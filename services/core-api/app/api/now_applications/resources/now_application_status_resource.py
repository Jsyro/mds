from datetime import datetime
from flask_restplus import Resource, reqparse, inputs
from flask import current_app

from app.extensions import api
from app.api.utils.access_decorators import requires_role_view_all, requires_role_edit_permit

from app.api.utils.resources_mixins import UserMixin
from app.api.now_applications.models.now_application_identity import NOWApplicationIdentity
from app.api.now_applications.models.now_application_status import NOWApplicationStatus
from app.api.now_applications.response_models import NOW_APPLICATION_STATUS_CODES

from app.api.mines.permits.permit.models.permit import Permit
from app.api.mines.permits.permit_amendment.models.permit_amendment import PermitAmendment
from app.api.parties.party_appt.models.mine_party_appt import MinePartyAppointment
from werkzeug.exceptions import BadRequest, NotFound


class NOWApplicationStatusCodeResource(Resource, UserMixin):
    @api.doc(description='Get a list of all Notice of Work status codes.', params={})
    @requires_role_view_all
    @api.marshal_with(NOW_APPLICATION_STATUS_CODES, code=200, envelope='records')
    def get(self):
        return NOWApplicationStatus.get_all()


class NOWApplicationStatusResource(Resource, UserMixin):
    parser = reqparse.RequestParser(trim=True)
    parser.add_argument(
        'issue_date', location='json', type=inputs.datetime_from_iso8601, store_missing=False)
    parser.add_argument(
        'auth_end_date', location='json', type=inputs.datetime_from_iso8601, store_missing=False)
    parser.add_argument(
        'now_application_status_code',
        type=str,
        location='json',
        help='Whether the permit is an exploration permit or not.')

    @api.doc(description='Update Status of an Application', params={})
    @requires_role_edit_permit
    def put(self, application_guid):
        data = self.parser.parse_args()
        issue_date = data.get('issue_date', None)
        auth_end_date = data.get('auth_end_date', None)
        now_application_status_code = data.get('now_application_status_code', None)

        now_application_identity = NOWApplicationIdentity.find_by_guid(application_guid)
        if not now_application_identity:
            raise NotFound('No identity record for this application guid.')

        if now_application_identity.now_application_id is None:
            raise NotImplemented(
                'This application has not been imported. Please import an application before making changes.'
            )

        if now_application_status_code is not None and now_application_identity.now_application.now_application_status_code != now_application_status_code:
            now_application_identity.now_application.status_updated_date = datetime.today()
            now_application_identity.now_application.now_application_status_code = now_application_status_code

            # Approved
            if now_application_status_code == 'AIA':
                permit = Permit.find_by_now_application_guid(application_guid)
                if not permit:
                    raise NotFound('No permit found for this application.')

                permit_amendment = PermitAmendment.find_by_now_application_guid(application_guid)
                if not permit_amendment:
                    raise NotFound('No permit amendment found for this application.')

                #move out of draft
                if permit.permit_status_code == 'D':
                    permit.permit_status_code = 'O'

                #assign permit_no
                permit.assign_permit_no(
                    now_application_identity.now_application.notice_of_work_type_code[0])

                permit.save()

                permit_amendment.permit_amendment_status_code = 'ACT'
                permit_amendment.issue_date = issue_date
                permit_amendment.authorization_end_date = auth_end_date
                permit_amendment.save()

                #create contacts
                for contact in now_application_identity.now_application.contacts:
                    new_permittee = False

                    if contact.mine_party_appt_type_code == "PMT":
                        current_mpa = MinePartyAppointment.find_current_appointments(
                            mine_party_appt_type_code='PMT', permit_id=permit.permit_id)

                        if current_mpa is None or len(current_mpa) == 0:
                            new_permittee = True

                        if len(current_mpa) == 1:
                            if current_mpa[0].party_guid != contact.party_guid:
                                current_mpa[0].end_date = start_date - timedelta(days=1)
                                current_mpa[0].save()
                                new_permittee = True

                        if len(current_mpa) > 1:
                            raise BadRequest(
                                'This permit has more than one active permittee. Please resolve this and try again.'
                            )

                    if contact.mine_party_appt_type_code != "PMT" or new_permittee == True:
                        mine_party_appointment = MinePartyAppointment.create(
                            mine=now_application_identity.mine
                            if contact.mine_party_appt_type_code != 'PMT' else None,
                            permit=permit if contact.mine_party_appt_type_code == 'PMT' else None,
                            party_guid=contact.party_guid,
                            mine_party_appt_type_code=contact.mine_party_appt_type_code,
                            start_date=datetime.utcnow(),
                            end_date=None,
                            processed_by=self.get_user_info())
                        mine_party_appointment.save()

                #TODO: Documents / CRR

        return 200