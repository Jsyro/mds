import React from "react";
import PropTypes from "prop-types";
import EditNoticeOfWorkDocumentForm from "@/components/Forms/noticeOfWork/EditNoticeOfWorkDocumentForm";

const propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  title: PropTypes.string,
  now_application_guid: PropTypes.string.isRequired,
  categoriesToShow: PropTypes.arrayOf(PropTypes.string),
  initialValues: PropTypes.objectOf(PropTypes.any),
};

const defaultProps = {
  title: "",
  categoriesToShow: [],
  initialValues: {},
};

export const EditNoticeOfWorkDocumentModal = (props) => {
  return (
    <div>
      <EditNoticeOfWorkDocumentForm
        {...props}
        initialValues={{
          now_application_guid: props.now_application_guid,
          ...props.initialValues,
        }}
      />
    </div>
  );
};

EditNoticeOfWorkDocumentModal.propTypes = propTypes;
EditNoticeOfWorkDocumentModal.defaultProps = defaultProps;

export default EditNoticeOfWorkDocumentModal;
