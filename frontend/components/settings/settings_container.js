import { connect } from "react-redux";
import { fetchSetting, updateSetting, createStaffPage, insertStickers, clearStickers, insertLayout } from "../../actions/setting_actions";
// import { insertLayout } from "../../util/setting_api_util";
import Settings from "./settings";

const mapStateToProps = (state) => ({
  settings: state.entities.settings,
});

const mapDispatchToProps = (dispatch) => ({
  fetchSetting: (shopId) => dispatch(fetchSetting(shopId)),
  updateSetting: (setting) => dispatch(updateSetting(setting)),
  createStaffPage: (pageData) => dispatch(createStaffPage(pageData)),
  insertStickers: () => dispatch(insertStickers()),
  clearStickers: () => dispatch(clearStickers()),
  insertLayout: (layout) =>dispatch(insertLayout(layout)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
