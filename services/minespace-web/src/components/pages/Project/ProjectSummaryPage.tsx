import React, { FC, useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { flattenObject } from "@common/utils/helpers";
import { Link, Prompt, useHistory, useLocation, useParams } from "react-router-dom";
import {
  submit,
  formValueSelector,
  getFormSyncErrors,
  getFormValues,
  reset,
  touch,
} from "redux-form";
import { Row, Col, Typography, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getMines } from "@common/selectors/mineSelectors";
import {
  getProjectSummary,
  getFormattedProjectSummary,
  getProject,
} from "@common/selectors/projectSelectors";
import {
  getProjectSummaryDocumentTypesHash,
  getProjectSummaryAuthorizationTypesArray,
} from "@common/selectors/staticContentSelectors";
import {
  createProjectSummary,
  updateProjectSummary,
  fetchProjectById,
  updateProject,
} from "@common/actionCreators/projectActionCreator";
import { fetchMineRecordById } from "@common/actionCreators/mineActionCreator";
import { clearProjectSummary } from "@common/actions/projectActions";
import * as FORM from "@/constants/forms";
import Loading from "@/components/common/Loading";
import {
  EDIT_PROJECT_SUMMARY,
  MINE_DASHBOARD,
  ADD_PROJECT_SUMMARY,
  EDIT_PROJECT,
} from "@/constants/routes";
import ProjectSummaryForm from "@/components/Forms/projects/projectSummary/ProjectSummaryForm";
import { IMine, IProjectSummary, IProject } from "@mds/common";
import { ActionCreator } from "@/interfaces/actionCreator";

interface ProjectSummaryPageProps {
  mines: Partial<IMine>[];
  projectSummary: Partial<IProjectSummary>;
  project: Partial<IProject>;
  fetchProjectById: ActionCreator<typeof fetchProjectById>;
  createProjectSummary: ActionCreator<typeof createProjectSummary>;
  updateProjectSummary: ActionCreator<typeof updateProjectSummary>;
  fetchMineRecordById: ActionCreator<typeof fetchMineRecordById>;
  updateProject: ActionCreator<typeof updateProject>;
  clearProjectSummary: () => any;
  projectSummaryDocumentTypesHash: Record<string, string>;
  submit: (arg1?: string) => any;
  formValueSelector: (arg1: string, arg2?: any) => any;
  getFormSyncErrors: (arg1: string) => any;
  reset: (arg1: string) => any;
  touch: (arg1?: string, arg2?: any) => any;
  formErrors: Record<string, string>;
  formValues: any;
  projectSummaryAuthorizationTypesArray: any[];
  anyTouched: boolean;
  formattedProjectSummary: any;
  location: Record<any, string>;
}

interface IParams {
  mineGuid?: string;
  projectGuid?: string;
  projectSummaryGuid?: string;
  tab?: any;
}

const tabs = [
  "basic-information",
  "project-contacts",
  "project-dates",
  "authorizations-involved",
  "document-upload",
];

export const ProjectSummaryPage: FC<ProjectSummaryPageProps> = (props) => {
  const {
    mines,
    formattedProjectSummary,
    project,
    projectSummary,
    projectSummaryAuthorizationTypesArray,
    projectSummaryDocumentTypesHash,
    formValues,
    formErrors,
    submit,
    touch,
    anyTouched,
    reset,
    fetchProjectById,
    fetchMineRecordById,
    clearProjectSummary,
    createProjectSummary,
    updateProjectSummary,
    updateProject,
  } = props;

  const { mineGuid, projectGuid, projectSummaryGuid, tab } = useParams<IParams>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const activeTab = tab ?? tabs[0];

  const handleFetchData = () => {
    if (projectGuid && projectSummaryGuid) {
      setIsEditMode(true);
      return fetchProjectById(projectGuid);
    }
    return fetchMineRecordById(mineGuid);
  };

  useEffect(() => {
    if (!isLoaded) {
      handleFetchData().then(() => setIsLoaded(true));
    }
    return () => {
      clearProjectSummary();
    };
  }, []);

  const handleTransformPayload = (values) => {
    let payloadValues: any = {};
    const updatedAuthorizations = [];
    Object.keys(values).forEach((key) => {
      // Pull out form properties from request object that match known authorization types
      if (values[key] && projectSummaryAuthorizationTypesArray.includes(key)) {
        const project_summary_guid = values?.project_summary_guid;
        const authorization = values?.authorizations?.find(
          (auth) => auth?.project_summary_authorization_type === key
        );
        updatedAuthorizations.push({
          ...values[key],
          // Conditionally add project_summary_guid and project_summary_authorization_guid properties if this a pre-existing authorization
          // ... otherwise treat it as a new one which won't have those two properties yet.
          ...(project_summary_guid && { project_summary_guid }),
          ...(authorization && {
            project_summary_authorization_guid: authorization?.project_summary_authorization_guid,
          }),
          project_summary_authorization_type: key,
          project_summary_permit_type:
            key === "OTHER" ? ["OTHER"] : values[key]?.project_summary_permit_type,
          existing_permits_authorizations:
            values[key]?.existing_permits_authorizations?.split(",") || [],
        });
        // eslint-disable-next-line no-param-reassign
        delete values[key];
      }
    });
    payloadValues = {
      ...values,
      authorizations: updatedAuthorizations,
    };
    // eslint-disable-next-line no-param-reassign
    delete payloadValues.authorizationOptions;
    return payloadValues;
  };

  const handleUpdateProjectSummary = (values, message) => {
    const payload = handleTransformPayload(values);
    setIsLoaded(false);
    return updateProjectSummary(
      {
        projectGuid,
        projectSummaryGuid,
      },
      payload,
      message
    )
      .then(() => {
        updateProject(
          { projectGuid },
          { mrc_review_required: payload.mrc_review_required, contacts: payload.contacts },
          "Successfully updated project.",
          false
        );
      })
      .then(async () => {
        return handleFetchData();
      })
      .then(() => {
        setIsLoaded(true);
      });
  };

  const handleCreateProjectSummary = (values, message) => {
    return createProjectSummary(
      {
        mineGuid: mineGuid,
      },
      handleTransformPayload(values),
      message
    ).then(({ data: { project_guid, project_summary_guid } }) => {
      history.replace(EDIT_PROJECT_SUMMARY.dynamicRoute(project_guid, project_summary_guid));
    });
  };

  const handleTabChange = (newTab) => {
    const url = isEditMode
      ? EDIT_PROJECT_SUMMARY.dynamicRoute(projectGuid, projectSummaryGuid, newTab)
      : ADD_PROJECT_SUMMARY.dynamicRoute(mineGuid, newTab);
    history.push(url);
  };

  const handleSaveData = (e, newActiveTab) => {
    if (e) {
      e.preventDefault();
    }
    const message = newActiveTab
      ? "Successfully updated the project description."
      : "Successfully submitted a project description to the Province of British Columbia.";
    const values = { ...formValues, status_code: "SUB" };
    submit(FORM.ADD_EDIT_PROJECT_SUMMARY);
    touch(FORM.ADD_EDIT_PROJECT_SUMMARY);
    const errors = Object.keys(flattenObject(formErrors));
    if (errors.length === 0) {
      if (!isEditMode) {
        handleCreateProjectSummary(values, message);
      }
      if (projectGuid && projectSummaryGuid) {
        handleUpdateProjectSummary(values, message);
      }
    }
    handleTabChange(newActiveTab);
  };

  const handleSaveDraft = () => {
    const currentTabIndex = tabs.indexOf(activeTab);
    const newActiveTab = tabs[currentTabIndex + 1];
    const message = "Successfully saved a draft project description.";
    const values = { ...formValues, status_code: "DFT" };
    submit(FORM.ADD_EDIT_PROJECT_SUMMARY);
    touch(FORM.ADD_EDIT_PROJECT_SUMMARY);
    const errors = Object.keys(flattenObject(formErrors));
    if (errors.length === 0) {
      if (!isEditMode) {
        handleCreateProjectSummary(values, message);
      }
      if (projectGuid && projectSummaryGuid) {
        handleUpdateProjectSummary(values, message);
      }
    }
    handleTabChange(newActiveTab);
  };

  const mineName = isEditMode
    ? formattedProjectSummary?.mine_name || ""
    : mines[mineGuid]?.mine_name || "";
  const title = isEditMode
    ? `Edit project description - ${projectSummary?.project_summary_title}`
    : `New project description for ${mineName}`;

  const initialValues = isEditMode
    ? { ...formattedProjectSummary, mrc_review_required: project.mrc_review_required }
    : {};

  return (
    (isLoaded && (
      <>
        <Prompt
          when={anyTouched}
          message={(newLocation, action) => {
            if (action === "REPLACE") {
              reset(FORM.ADD_EDIT_PROJECT_SUMMARY);
            }
            return location.pathname !== newLocation.pathname &&
              !newLocation.pathname.includes("project-description") &&
              anyTouched
              ? "You have unsaved changes. Are you sure you want to leave without saving?"
              : true;
          }}
        />
        <Row>
          <Col span={24}>
            <Typography.Title>{title}</Typography.Title>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {isEditMode ? (
              <Link to={EDIT_PROJECT.dynamicRoute(projectSummary.project_guid)}>
                <ArrowLeftOutlined className="padding-sm--right" />
                Back to: {project.project_title} Project Overview page
              </Link>
            ) : (
              <Link to={MINE_DASHBOARD.dynamicRoute(mineGuid, "applications")}>
                <ArrowLeftOutlined className="padding-sm--right" />
                Back to: {mineName} Applications page
              </Link>
            )}
          </Col>
        </Row>
        <Divider />
        <ProjectSummaryForm
          initialValues={initialValues}
          mineGuid={mineGuid}
          isEditMode={isEditMode}
          handleSaveData={handleSaveData}
          handleSaveDraft={handleSaveDraft}
          projectSummaryDocumentTypesHash={projectSummaryDocumentTypesHash}
          handleTabChange={handleTabChange}
          activeTab={activeTab}
        />
      </>
    )) || <Loading />
  );
};

const selector = formValueSelector(FORM.ADD_EDIT_PROJECT_SUMMARY);
const mapStateToProps = (state) => ({
  anyTouched: state.form[FORM.ADD_EDIT_PROJECT_SUMMARY]?.anyTouched || false,
  fieldsTouched: state.form[FORM.ADD_EDIT_PROJECT_SUMMARY]?.fields || {},
  mines: getMines(state),
  projectSummary: getProjectSummary(state),
  formattedProjectSummary: getFormattedProjectSummary(state),
  project: getProject(state),
  projectSummaryDocumentTypesHash: getProjectSummaryDocumentTypesHash(state),
  projectSummaryAuthorizationTypesArray: getProjectSummaryAuthorizationTypesArray(state),
  formErrors: getFormSyncErrors(FORM.ADD_EDIT_PROJECT_SUMMARY)(state),
  formValues: getFormValues(FORM.ADD_EDIT_PROJECT_SUMMARY)(state),
  contacts: selector(state, "contacts"),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      createProjectSummary,
      updateProjectSummary,
      fetchMineRecordById,
      clearProjectSummary,
      fetchProjectById,
      updateProject,
      submit,
      reset,
      touch,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSummaryPage);
