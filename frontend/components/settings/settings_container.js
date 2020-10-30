import { connect } from "react-redux";
import { fetchSetting, updateSetting, createStaffPage } from "../../actions/setting_actions";
import Settings from "./settings";

const mapStateToProps = (state) => ({
  settings: state.entities.settings,
});

const mapDispatchToProps = (dispatch) => ({
  fetchSetting: (shopId) => dispatch(fetchSetting(shopId)),
  updateSetting: (setting) => dispatch(updateSetting(setting)),
  createStaffPage: (pageData) => dispatch(createStaffPage(pageData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
