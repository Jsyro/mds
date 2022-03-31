from app.api.utils.models_mixins import SoftDeleteMixin, AuditMixin, Base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.schema import FetchedValue
from app.extensions import db
from app.api.constants import *
from app.api.utils.query import QueryWithSoftDelete


class Nod(SoftDeleteMixin, AuditMixin, Base):
    __tablename__ = 'nod'
    _edit_groups = [PERMIT_EDIT_GROUP]
    _edit_key = PERMIT_EDIT_GROUP

    nod_guid = db.Column(UUID(as_uuid=True), server_default=FetchedValue(), primary_key=True)
    mine_guid = db.Column(UUID(as_uuid=True), db.ForeignKey('mine.mine_guid'), nullable=False)
    permit_guid = db.Column(UUID(as_uuid=True), db.ForeignKey('permit.permit_guid'), nullable=False)
    nod_title = db.Column(db.String(50), nullable=False)
    mine = db.relationship('Mine', lazy='select')
    permit = db.relationship('Permit', lazy='select')

    # query = QueryWithSoftDelete()

    @classmethod
    def create(cls, mine, permit, nod_title, add_to_session=True):
        new_nod = cls(permit_guid=permit.permit_guid, mine_guid=mine.mine_guid, nod_title=nod_title)

        if add_to_session:
            new_nod.save(commit=False)
        return new_nod

    @classmethod
    def find_one(cls, __guid):
        return cls.query.get_or_404(nod_guid=__guid)

    @classmethod
    def find_all_by_permit_guid(cls, __guid):
        return cls.query.filter_by(permit_guid=__guid).all()
