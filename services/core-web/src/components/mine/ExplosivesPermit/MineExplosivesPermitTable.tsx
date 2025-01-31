import React, { FC } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, Button, Dropdown, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, WarningOutlined } from "@ant-design/icons";
import { dateSorter, formatDate } from "@common/utils/helpers";
import * as Strings from "@common/constants/strings";
import CoreTable from "@/components/common/CoreTable";
import {
  getExplosivesPermitBadgeStatusType,
  getExplosivesPermitClosedBadgeStatusType,
} from "@/constants/theme";
import AuthorizationWrapper from "@/components/common/wrappers/AuthorizationWrapper";
import * as Permission from "@/constants/permissions";
import DocumentLink from "@/components/common/DocumentLink";
import { EDIT, CARAT, TRASHCAN } from "@/constants/assets";
import { CoreTooltip } from "@/components/common/CoreTooltip";
import {
  isFeatureEnabled,
  Feature,
  IExplosivesPermit,
  IExplosivesPermitDocument,
} from "@mds/common";
import { ColumnType } from "antd/lib/table";
import moment from "moment-timezone";
import { ITableAction } from "@/components/common/CoreTableCommonColumns";
import VioletEditIcon from "@/assets/icons/violet-edit";
import ActionMenu, {
  generateActionMenuItems,
  deleteConfirmWrapper,
} from "@/components/common/ActionMenu";
import { userHasRole } from "@common/reducers/authenticationReducer";

interface MineExplosivesPermitTableProps {
  data: IExplosivesPermit[];
  isLoaded: boolean;
  handleOpenExplosivesPermitDecisionModal: (event, record: IExplosivesPermit) => void;
  handleOpenExplosivesPermitStatusModal: (event, record: IExplosivesPermit) => void;
  handleDeleteExplosivesPermit: (event, record: IExplosivesPermit) => void;
  isPermitTab: boolean;
  explosivesPermitDocumentTypeOptionsHash: any;
  explosivesPermitStatusOptionsHash: any;
  handleOpenAddExplosivesPermitModal: (
    event,
    isPermitTab: boolean,
    record: IExplosivesPermit
  ) => void;
  handleOpenViewMagazineModal: (event, record: IExplosivesPermit, type: string) => void;
  handleOpenViewExplosivesPermitModal: (event, record: IExplosivesPermit) => void;
}

type MineExplosivesTableItem = IExplosivesPermit & {
  documents: IExplosivesPermitDocument;
  key: string;
  isExpired: boolean;
};

const transformRowData = (permits: IExplosivesPermit[]) => {
  return permits.map((permit) => {
    const mostRecentVersion =
      permit.explosives_permit_amendments?.length > 0
        ? permit.explosives_permit_amendments[permit.explosives_permit_amendments.length - 1]
        : permit;
    return {
      ...mostRecentVersion,
      key: mostRecentVersion.explosives_permit_guid,
      documents: mostRecentVersion.documents,
      isExpired: mostRecentVersion.expiry_date && moment(mostRecentVersion.expiry_date).isBefore(),
    };
  });
};

const hideColumn = (condition) => (condition ? "column-hide" : "");

const MineExplosivesPermitTable: FC<RouteComponentProps & MineExplosivesPermitTableProps> = ({
  data,
  isLoaded,
  isPermitTab,
  explosivesPermitDocumentTypeOptionsHash,
  explosivesPermitStatusOptionsHash,
  handleOpenViewMagazineModal,
  handleOpenViewExplosivesPermitModal,
  ...props
}) => {
  const isAdmin = useSelector((state) => userHasRole(state, Permission.ADMIN));
  const editIcon = isFeatureEnabled(Feature.ESUP_PERMIT_AMENDMENT) ? (
    <EditOutlined />
  ) : (
    <VioletEditIcon className="padding-sm" />
  );
  const viewIcon = isFeatureEnabled(Feature.ESUP_PERMIT_AMENDMENT) ? (
    <EyeOutlined />
  ) : (
    <EyeOutlined className="padding-sm icon-lg icon-svg-filter" />
  );

  const columns: ColumnType<MineExplosivesTableItem>[] = [
    {
      title: "Permit #",
      dataIndex: "permit_number",
      render: (text) => (
        <div title="Permit #" className={hideColumn(!isPermitTab)}>
          {text}
        </div>
      ),
      sorter: false,
      className: hideColumn(!isPermitTab),
    },
    {
      title: "Application #",
      dataIndex: "application_number",
      render: (text) => (
        <div title="Application #" className={hideColumn(isPermitTab)}>
          {text}
        </div>
      ),
      sorter: false,
      className: hideColumn(isPermitTab),
    },
    {
      title: "Mines Act Permit #",
      dataIndex: "mines_permit_number",
      render: (text) => <div title="Mines Act Permit #">{text}</div>,
      sorter: false,
    },
    {
      title: "Notice of Work #",
      dataIndex: "now_number",
      render: (text) => <div title="Notice of Work #">{text || Strings.EMPTY_FIELD}</div>,
      sorter: false,
    },
    {
      title: "Status",
      dataIndex: "application_status",
      render: (text) => (
        <div title="Status" className={hideColumn(isPermitTab)}>
          <Badge
            status={getExplosivesPermitBadgeStatusType(explosivesPermitStatusOptionsHash[text])}
            style={{ marginRight: 5 }}
          />
          {explosivesPermitStatusOptionsHash[text] || Strings.EMPTY_FIELD}
        </div>
      ),
      className: hideColumn(isPermitTab),
      sorter: false,
    },
    {
      title: "Status",
      dataIndex: "is_closed",
      render: (text) => (
        <div title="Status" className={hideColumn(!isPermitTab)}>
          <Badge
            status={getExplosivesPermitClosedBadgeStatusType(text)}
            style={{ marginRight: 5 }}
          />
          {text ? "Closed" : "Open" || Strings.EMPTY_FIELD}
        </div>
      ),
      className: hideColumn(!isPermitTab),
      sorter: false,
    },
    {
      title: "Decision Reason",
      dataIndex: "decision_reason",
      render: (text) => (
        <div title="Decision Reason" className={hideColumn(isPermitTab)}>
          {text || Strings.EMPTY_FIELD}
        </div>
      ),
      className: hideColumn(isPermitTab),
      sorter: false,
    },
    {
      title: "Issuing Inspector",
      dataIndex: "issuing_inspector_name",
      render: (text) => (
        <div title="Issuing Inspector" className={hideColumn(!isPermitTab)}>
          {text || Strings.EMPTY_FIELD}
        </div>
      ),
      sorter: false,
      className: hideColumn(!isPermitTab),
    },
    {
      title: "Source",
      dataIndex: "originating_system",
      render: (text) => <div title="Source">{text || Strings.EMPTY_FIELD}</div>,
      sorter: false,
    },
    {
      title: "Permittee",
      dataIndex: "permittee_name",
      render: (text) => <div title="Permittee">{text || Strings.EMPTY_FIELD}</div>,
      sorter: false,
    },
    {
      title: "Application Date",
      dataIndex: "application_date",
      render: (text) => (
        <div title="Application Date">{formatDate(text) || Strings.EMPTY_FIELD}</div>
      ),
      sorter: dateSorter("application_date"),
    },
    {
      title: "Issue Date",
      dataIndex: "issue_date",
      render: (text) => (
        <div title="Issue Date" className={hideColumn(!isPermitTab)}>
          {formatDate(text) || Strings.EMPTY_FIELD}
        </div>
      ),
      sorter: dateSorter("issue_date"),
      className: hideColumn(!isPermitTab),
    },
    {
      title: "Expiry Date",
      dataIndex: "expiry_date",
      render: (text, record) => (
        <div title="Expiry Date" className={hideColumn(!isPermitTab)}>
          {record.isExpired && (
            <Tooltip placement="topLeft" title="Permit has Expired.">
              <WarningOutlined className="icon-lg red" />
            </Tooltip>
          )}{" "}
          {formatDate(text) || Strings.EMPTY_FIELD}
        </div>
      ),
      sorter: dateSorter("expiry_date"),
      className: hideColumn(!isPermitTab),
    },
    {
      title: (
        <span>
          Explosive Quantity
          <CoreTooltip title="Total Explosive Quantity: This is the total quantity stored on site. Click to view more details" />
        </span>
      ),
      dataIndex: "total_explosive_quantity",
      render: (text, record) => (
        <div
          title="Explosive Quantity"
          className="underline"
          onClick={(event) => handleOpenViewMagazineModal(event, record, "EXP")}
        >
          {text || "0"} kg
        </div>
      ),
      sorter: false,
    },
    {
      title: (
        <span>
          Detonator Quantity
          <CoreTooltip title="Total Detonator Quantity: This is the total quantity stored on site. Click to view more details" />
        </span>
      ),
      dataIndex: "total_detonator_quantity",
      render: (text, record) => (
        <div
          title="Detonator Quantity"
          className="underline"
          onClick={(event) => handleOpenViewMagazineModal(event, record, "DET")}
        >
          {text || "0"} units
        </div>
      ),
      sorter: false,
    },
    {
      title: "",
      key: "addEditButton",
      align: "right",
      render: (record) => {
        const isApproved = record.application_status === "APP";
        const isProcessed = record.application_status !== "REC";
        const hasDocuments =
          record.documents?.filter((doc) =>
            ["LET", "PER"].includes(doc.explosives_permit_document_type_code)
          )?.length > 0;
        const isCoreSource = record.originating_system === "Core";
        const approvedMenu: ITableAction[] = isFeatureEnabled(Feature.ESUP_PERMIT_AMENDMENT)
          ? [
              {
                key: "view",
                label: "View",
                clickFunction: (event) => handleOpenViewExplosivesPermitModal(event, record),
                icon: viewIcon,
              },
              {
                key: "0",
                label: "Edit Documents",
                clickFunction: (event, record) =>
                  props.handleOpenAddExplosivesPermitModal(event, isPermitTab, record),
                icon: editIcon,
              },
              {
                key: "edit",
                label: "Edit Permit",
                clickFunction: (event, record) =>
                  props.handleOpenAddExplosivesPermitModal(event, isPermitTab, record),
                icon: editIcon,
              },
            ]
          : [
              {
                key: "0",
                label: "Edit Documents",
                clickFunction: (event, record) =>
                  props.handleOpenAddExplosivesPermitModal(event, isPermitTab, record),
                icon: editIcon,
              },
              {
                key: "edit",
                label: "Edit Permit",
                clickFunction: (event, record) =>
                  props.handleOpenAddExplosivesPermitModal(event, isPermitTab, record),
                icon: editIcon,
              },
            ];
        const menu: ITableAction[] = isFeatureEnabled(Feature.ESUP_PERMIT_AMENDMENT)
          ? [
              ...(!isProcessed
                ? [
                    {
                      key: "view",
                      label: "View",
                      clickFunction: (event) => handleOpenViewExplosivesPermitModal(event, record),
                      icon: viewIcon,
                    },
                    {
                      key: "process",
                      label: "Process",
                      clickFunction: (event) =>
                        props.handleOpenExplosivesPermitDecisionModal(event, record),
                      icon: editIcon,
                    },
                    {
                      key: "edit",
                      label: "Edit",
                      clickFunction: (event) =>
                        props.handleOpenAddExplosivesPermitModal(event, isPermitTab, record),
                      icon: editIcon,
                    },
                  ]
                : []),
              {
                key: "0",
                label: "Edit Documents",
                clickFunction: (event) =>
                  props.handleOpenAddExplosivesPermitModal(event, isPermitTab, record),
                icon: editIcon,
              },
            ]
          : [
              ...(!isProcessed
                ? [
                    {
                      key: "process",
                      label: "Process",
                      clickFunction: (event) =>
                        props.handleOpenExplosivesPermitDecisionModal(event, record),
                      icon: editIcon,
                    },
                    {
                      key: "edit",
                      label: "Edit",
                      clickFunction: (event) =>
                        props.handleOpenAddExplosivesPermitModal(event, isPermitTab, record),
                      icon: editIcon,
                    },
                  ]
                : []),
              {
                key: "0",
                label: "Edit Documents",
                clickFunction: (event) =>
                  props.handleOpenAddExplosivesPermitModal(event, isPermitTab, record),
                icon: editIcon,
              },
            ];
        const deleteAction: ITableAction = {
          key: "delete",
          label: "Delete",
          clickFunction: (event) => {
            deleteConfirmWrapper(
              `Explosives Storage & Use Permit${isPermitTab ? "" : " Application"}`,
              () => props.handleDeleteExplosivesPermit(event, record)
            );
          },
          icon: <DeleteOutlined />,
        };

        const currentMenu = isApproved ? approvedMenu : menu;
        const showActions = !isApproved || (isApproved && isPermitTab);
        const showDelete =
          (isAdmin && record.application_status !== "APP" && !isPermitTab) ||
          (isApproved && isPermitTab);

        if (showDelete && isFeatureEnabled(Feature.ESUP_PERMIT_AMENDMENT)) {
          currentMenu.push(deleteAction);
        }

        return (
          <div className="btn--middle flex">
            {isApproved && !hasDocuments && isCoreSource && (
              <AuthorizationWrapper permission={Permission.EDIT_EXPLOSIVES_PERMITS}>
                {!isFeatureEnabled(Feature.ESUP_PERMIT_AMENDMENT) && (
                  <Button
                    type="text"
                    className="full-mobile"
                    htmlType="submit"
                    onClick={(event) =>
                      props.handleOpenExplosivesPermitDecisionModal(event, record)
                    }
                  >
                    Re-generate docs
                  </Button>
                )}
              </AuthorizationWrapper>
            )}
            {showActions && (
              <AuthorizationWrapper permission={Permission.EDIT_EXPLOSIVES_PERMITS}>
                {isFeatureEnabled(Feature.ESUP_PERMIT_AMENDMENT) ? (
                  <ActionMenu record={record} actionItems={currentMenu} category="ESUP" />
                ) : (
                  <Dropdown
                    className="full-height full-mobile"
                    menu={{ items: generateActionMenuItems(currentMenu, record) }}
                    placement="bottomLeft"
                  >
                    <Button className="permit-table-button">
                      <div className="padding-sm">
                        <img
                          className="padding-sm--right icon-svg-filter"
                          src={EDIT}
                          alt="Add/Edit"
                        />
                        {isApproved ? "Edit" : "Process/Edit"}
                        <img
                          className="padding-sm--right icon-svg-filter"
                          src={CARAT}
                          alt="Menu"
                          style={{ paddingLeft: "5px" }}
                        />
                      </div>
                    </Button>
                  </Dropdown>
                )}
              </AuthorizationWrapper>
            )}
            {showDelete && !isFeatureEnabled(Feature.ESUP_PERMIT_AMENDMENT) && (
              <AuthorizationWrapper permission={Permission.ADMIN}>
                <Popconfirm
                  placement="topLeft"
                  title={`Are you sure you want to delete the Explosives Storage & Use ${
                    isPermitTab ? "Permit" : "Permit Application"
                  }?`}
                  onConfirm={(event) => props.handleDeleteExplosivesPermit(event, record)}
                  okText="Delete"
                  cancelText="Cancel"
                >
                  <Button ghost type="primary" size="small">
                    <img src={TRASHCAN} alt="Remove Permit" />
                  </Button>
                </Popconfirm>
              </AuthorizationWrapper>
            )}
          </div>
        );
      },
    },
  ];

  const documentDetailColumns: ColumnType<IExplosivesPermitDocument>[] = [
    {
      title: "Category",
      dataIndex: "explosives_permit_document_type_code",
      key: "explosives_permit_document_type_code",
      render: (text) => (
        <div title="Upload Date">
          {explosivesPermitDocumentTypeOptionsHash[text] || Strings.EMPTY_FIELD}
        </div>
      ),
    },
    {
      title: "Document Name",
      dataIndex: "document_name",
      key: "document_name",
      render: (text, record) => (
        <div className="cap-col-height" title="Document Name">
          <DocumentLink documentManagerGuid={record.document_manager_guid} documentName={text} />
          <br />
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "upload_date",
      key: "upload_date",
      render: (text) => <div title="Upload Date">{formatDate(text) || Strings.EMPTY_FIELD}</div>,
    },
  ];

  return (
    <CoreTable
      condition={isLoaded}
      dataSource={transformRowData(data)}
      rowKey={(record) => record.explosives_permit_guid}
      classPrefix="explosives-permits"
      columns={columns}
      expandProps={{
        rowKey: (document) => document.mine_document_guid,
        rowExpandable: (record) => record.documents.length > 0,
        recordDescription: "document details",
        getDataSource: (record) => record.documents,
        subTableColumns: documentDetailColumns,
      }}
    />
  );
};

export default withRouter(MineExplosivesPermitTable);
