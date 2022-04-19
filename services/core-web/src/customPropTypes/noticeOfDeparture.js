import { PropTypes, shape } from "prop-types";

export const noticeOfDeparturePermit = shape({
  permit_id: PropTypes.number,
  permit_guid: PropTypes.string,
  permit_no: PropTypes.string,
  permit_status_code: PropTypes.string,
  current_permittee: PropTypes.string,
  permit_prefix: PropTypes.string,
});

export const noticeOfDeparture = shape({
  nod_guid: PropTypes.string,
  nod_title: PropTypes.string,
  permit: noticeOfDeparturePermit,
  create_user: PropTypes.string,
  create_timestamp: PropTypes.string,
  update_timestamp: PropTypes.string,
  submission_timestamp:  PropTypes.string,
  nod_status: PropTypes.string,
  nod_type: PropTypes.string,
});
