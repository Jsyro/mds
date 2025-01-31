import queryString from "query-string";
import DamsPage from "@common/components/tailings/dam/DamsPage";
import InformationRequirementsTablePage from "@/components/pages/Project/InformationRequirementsTablePage";
import InformationRequirementsTableSuccessPage from "@/components/pages/Project/InformationRequirementsTableSuccessPage";
import LandingPage from "@/components/pages/LandingPage";
import MajorMineApplicationPage from "@/components/pages/Project/MajorMineApplicationPage";
import MajorMineApplicationSuccessPage from "@/components/pages/Project/MajorMineApplicationSuccessPage";
import MineDashboard from "@/components/dashboard/mine/MineDashboard";
import MinesPage from "@/components/pages/MinesPage";
import ProjectPage from "@/components/pages/Project/ProjectPage";
import ProjectSummaryPage from "@/components/pages/Project/ProjectSummaryPage";
import ReturnPage from "@/components/pages/ReturnPage";
import TailingsSummaryPageWrapper from "@/components/pages/Tailings/TailingsSummaryPageWrapper";
import IncidentPage from "@/components/pages/Incidents/IncidentPage";
import IncidentSuccessPage from "@/components/pages/Incidents/IncidentSuccessPage";
import { UsersPage } from "@/components/pages/UsersPage";

export const HOME = {
  route: "/",
  component: LandingPage,
};

export const RETURN_PAGE = {
  route: "/return-page",
  component: ReturnPage,
};

export const MINES = {
  route: "/mines",
  component: MinesPage,
};

export const USERS = {
  route: "/users",
  component: UsersPage,
};

export const ADD_PROJECT_SUMMARY = {
  route: "/mines/:mineGuid/project-description/new/:tab",
  dynamicRoute: (mineGuid, tab = "basic-information") =>
    `/mines/${mineGuid}/project-description/new/${tab}`,
  component: ProjectSummaryPage,
};

export const EDIT_PROJECT_SUMMARY = {
  route: "/projects/:projectGuid/project-description/:projectSummaryGuid/:tab",
  dynamicRoute: (projectGuid, projectSummaryGuid, activeTab = "basic-information") =>
    `/projects/${projectGuid}/project-description/${projectSummaryGuid}/${activeTab}`,
  component: ProjectSummaryPage,
};

export const EDIT_PROJECT = {
  route: "/projects/:projectGuid/:tab",
  dynamicRoute: (projectGuid, activeTab = "overview") => `/projects/${projectGuid}/${activeTab}`,
  component: ProjectPage,
};

export const ADD_INFORMATION_REQUIREMENTS_TABLE = {
  route: "/projects/:projectGuid/information-requirements-table/new",
  dynamicRoute: (projectGuid) => `/projects/${projectGuid}/information-requirements-table/new`,
  component: InformationRequirementsTablePage,
};

export const RESUBMIT_INFORMATION_REQUIREMENTS_TABLE = {
  route: "/projects/:projectGuid/information-requirements-table/:irtGuid/resubmit",
  dynamicRoute: (projectGuid, irtGuid) =>
    `/projects/${projectGuid}/information-requirements-table/${irtGuid}/resubmit`,
  component: InformationRequirementsTablePage,
};

export const REVIEW_INFORMATION_REQUIREMENTS_TABLE = {
  route: "/projects/:projectGuid/information-requirements-table/:irtGuid/review/:tab",
  dynamicRoute: (projectGuid, irtGuid, tab = "introduction-and-project-overview") =>
    `/projects/${projectGuid}/information-requirements-table/${irtGuid}/review/${tab}`,
  component: InformationRequirementsTablePage,
};

export const INFORMATION_REQUIREMENTS_TABLE_SUCCESS = {
  route: "/projects/:projectGuid/information-requirements-table/:irtGuid/success",
  dynamicRoute: (projectGuid, irtGuid) =>
    `/projects/${projectGuid}/information-requirements-table/${irtGuid}/success`,
  component: InformationRequirementsTableSuccessPage,
};

export const EDIT_MAJOR_MINE_APPLICATION = {
  route: "/projects/:projectGuid/major-mine-application/:mmaGuid/edit",
  dynamicRoute: (projectGuid, mmaGuid) =>
    `/projects/${projectGuid}/major-mine-application/${mmaGuid}/edit`,
  component: MajorMineApplicationPage,
};

export const REVIEW_MAJOR_MINE_APPLICATION = {
  route: "/projects/:projectGuid/major-mine-application/:mmaGuid/review",
  dynamicRoute: (projectGuid, mmaGuid) =>
    `/projects/${projectGuid}/major-mine-application/${mmaGuid}/review`,
  component: MajorMineApplicationPage,
};

export const MAJOR_MINE_APPLICATION_SUCCESS = {
  route: "/projects/:projectGuid/major-mine-application/:mmaGuid/success",
  dynamicRoute: (projectGuid, mmaGuid) =>
    `/projects/${projectGuid}/major-mine-application/${mmaGuid}/success`,
  component: MajorMineApplicationSuccessPage,
};

export const ADD_MAJOR_MINE_APPLICATION = {
  route: "/projects/:projectGuid/major-mine-application/new",
  dynamicRoute: (projectGuid) => `/projects/${projectGuid}/major-mine-application/new`,
  component: MajorMineApplicationPage,
};

export const ADD_MINE_INCIDENT = {
  route: "/mines/:mineGuid/incidents/new",
  dynamicRoute: (mineGuid) => `/mines/${mineGuid}/incidents/new`,
  component: IncidentPage,
};

export const EDIT_MINE_INCIDENT = {
  route: "/mines/:mineGuid/incidents/:mineIncidentGuid",
  dynamicRoute: (mineGuid, mineIncidentGuid) => `/mines/${mineGuid}/incidents/${mineIncidentGuid}`,
  component: IncidentPage,
};

export const REVIEW_MINE_INCIDENT = {
  route: "/mines/:mineGuid/incidents/:mineIncidentGuid/review",
  dynamicRoute: (mineGuid, mineIncidentGuid) =>
    `/mines/${mineGuid}/incidents/${mineIncidentGuid}/review`,
  hashRoute: (mineGuid, mineIncidentGuid, link) =>
    `/mines/${mineGuid}/incidents/${mineIncidentGuid}/review/${link}`,
  component: IncidentPage,
};

export const MINE_INCIDENT_SUCCESS = {
  route: "/mines/:mineGuid/incidents/:mineIncidentGuid/success",
  dynamicRoute: (mineGuid, mineIncidentGuid) =>
    `/mines/${mineGuid}/incidents/${mineIncidentGuid}/success`,
  component: IncidentSuccessPage,
};

export const MINE_DASHBOARD = {
  route: "/mines/:id/:activeTab",
  dynamicRoute: (id, activeTab = "overview", filterParams) =>
    `/mines/${id}/${activeTab}?${queryString.stringify(filterParams)}`,
  component: MineDashboard,
};

export const ADD_TAILINGS_STORAGE_FACILITY = {
  route: "/mines/:mineGuid/tailings-storage-facility/new/:tab",
  dynamicRoute: (mineGuid, tab = "basic-information") =>
    `/mines/${mineGuid}/tailings-storage-facility/new/${tab}`,
  component: TailingsSummaryPageWrapper,
};

export const EDIT_TAILINGS_STORAGE_FACILITY = {
  route: "/mines/:mineGuid/tailings-storage-facility/:tailingsStorageFacilityGuid/:tab",
  dynamicRoute: (tailingsStorageFacilityGuid, mineGuid, activeTab = "basic-information") =>
    `/mines/${mineGuid}/tailings-storage-facility/${tailingsStorageFacilityGuid}/${activeTab}`,
  component: TailingsSummaryPageWrapper,
};

export const ADD_DAM = {
  route: "/mine/:mineGuid/tailings-storage-facility/:tailingsStorageFacilityGuid/dam/new/",
  dynamicRoute: (mineGuid, tailingsStorageFacilityGuid) =>
    `/mine/${mineGuid}/tailings-storage-facility/${tailingsStorageFacilityGuid}/dam/new/`,
  component: DamsPage,
};

export const EDIT_DAM = {
  route: "/mine/:mineGuid/tailings-storage-facility/:tailingsStorageFacilityGuid/dam/:damGuid",
  dynamicRoute: (mineGuid, tailingsStorageFacilityGuid, damGuid) =>
    `/mine/${mineGuid}/tailings-storage-facility/${tailingsStorageFacilityGuid}/dam/${damGuid}`,
  component: DamsPage,
};
