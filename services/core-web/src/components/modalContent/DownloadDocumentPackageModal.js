import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, Progress, Popconfirm } from "antd";
import { getDocumentDownloadState } from "@common/selectors/noticeOfWorkSelectors";
import NOWSubmissionDocuments from "@/components/noticeOfWork/applications/NOWSubmissionDocuments";
import { COLOR } from "@/constants/styles";
import CustomPropTypes from "@/customPropTypes";
import NOWDocuments from "../noticeOfWork/applications/NOWDocuments";

const propTypes = {
  submissionDocuments: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  coreDocuments: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  importNowSubmissionDocumentsJob: PropTypes.objectOf(PropTypes.any),
  mineGuid: PropTypes.string.isRequired,
  noticeOfWorkGuid: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  cancelDownload: PropTypes.func.isRequired,
  documentDownloadState: CustomPropTypes.documentDownloadState.isRequired,
  closeModal: PropTypes.func.isRequired,
};

const defaultProps = {
  importNowSubmissionDocumentsJob: {},
};

export const DownloadDocumentPackageModal = (props) => {
  const [selectedCoreRows, setSelectedCoreRows] = useState([]);
  const [selectedSubmissionRows, setSelectedSubmissionRows] = useState([]);
  return props.documentDownloadState.downloading ? (
    <div className="inline-flex flex-flow-column horizontal-center">
      <h4>Downloading Selected Files...</h4>
      <Progress
        className="padding-md--top padding-large--bottom"
        strokeColor={COLOR.violet}
        type="circle"
        percent={Math.round(
          (props.documentDownloadState.currentFile / props.documentDownloadState.totalFiles) * 100
        )}
      />
      <Button className="full-mobile" type="secondary" onClick={() => props.cancelDownload()}>
        Cancel
      </Button>
    </div>
  ) : (
    <div>
      <h4>vFCBC/NROS Application Files</h4>
      <NOWSubmissionDocuments
        now_application_guid={props.noticeOfWorkGuid}
        documents={props.submissionDocuments}
        importNowSubmissionDocumentsJob={props.importNowSubmissionDocumentsJob}
        selectedRows={{ selectedSubmissionRows, setSelectedSubmissionRows }}
      />
      <br />
      <h4>Additional Documents</h4>
      <NOWDocuments
        now_application_guid={props.noticeOfWorkGuid}
        mine_guid={props.mineGuid}
        documents={props.coreDocuments}
        isViewMode
        selectedRows={{ selectedCoreRows, setSelectedCoreRows }}
      />
      <br />
      <div className="right center-mobile padding-md--top">
        <Popconfirm
          placement="topRight"
          title="Are you sure you want to cancel?"
          onConfirm={props.closeModal}
          okText="Yes"
          cancelText="No"
        >
          <Button className="full-mobile">Cancel</Button>
        </Popconfirm>
        <Button
          className="full-mobile"
          type="primary"
          onClick={() => props.onSubmit(selectedCoreRows, selectedSubmissionRows)}
        >
          <DownloadOutlined className="padding-small--right icon-sm" />
          Download Referral Package
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  documentDownloadState: getDocumentDownloadState(state),
});

DownloadDocumentPackageModal.propTypes = propTypes;
DownloadDocumentPackageModal.defaultProps = defaultProps;

export default connect(mapStateToProps)(DownloadDocumentPackageModal);
