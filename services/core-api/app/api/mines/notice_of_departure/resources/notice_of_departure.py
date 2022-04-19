from flask_restplus import Resource, marshal_with, inputs
from werkzeug.exceptions import BadRequest, NotFound
from flask_restplus import reqparse
from app.extensions import api
from app.api.utils.resources_mixins import UserMixin
from app.api.utils.access_decorators import (requires_any_of, VIEW_ALL, MINESPACE_PROPONENT)
from app.api.mines.notice_of_departure.models.notice_of_departure import NoticeOfDeparture
from app.api.mines.permits.permit.models.permit import Permit
from app.api.mines.mine.models.mine import Mine
from app.api.mines.response_models import PERMIT_NOD_MODEL


class NoticeOfDepartureResource(Resource, UserMixin):

    @api.doc(params={
        'mine_guid': 'Mine guid.',
        'nod_guid': 'Mine guid.'
    })
    @requires_any_of([VIEW_ALL, MINESPACE_PROPONENT])
    @api.marshal_with(PERMIT_NOD_MODEL, code=200)
    def get(self, nod_guid):
        nod = NoticeOfDeparture.find(nod_guid)
        return nod