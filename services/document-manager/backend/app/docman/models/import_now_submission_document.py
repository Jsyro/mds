from app.extensions import db
from app.utils.models_mixins import Base


class ImportNowSubmissionDocument(Base):
    __tablename__ = 'import_now_submission_document'

    import_now_submission_document_id = db.Column(db.Integer, primary_key=True)

    def __repr__(self):
        return f'<{self.__class__.__name__} {self.import_now_submission_document_id}>'

    def json(self):
        return {
            'import_now_submission_document_id': self.import_now_submission_document_id,
        }
