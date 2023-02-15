import {StyleSheet} from 'react-native';
import {Colors} from '../../AppGlobalStyles/GlobalStylesheets';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 0,
    backgroundColor: Colors.LightBackground,
  },
  inRangeColor: {
    backgroundColor: Colors.GreenAccent,
  },
  outOfRangeColor: {
    backgroundColor: Colors.TileBackgroud,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
  },
  headerText: {
    flexGrow: 1,
    fontSize: 38,
    backgroundColor: Colors.GrayAccent,
    marginVertical: 0,
    paddingTop: 8,
    paddingBottom: 10,
    textAlign: 'center',
    color: Colors.Font,
  },
  headerButton: {
    flexGrow: 1,
    fontSize: 38,
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: Colors.GrayAccent,
    color: Colors.TileBackgroud,
    paddingTop: 14,
    paddingLeft: 14,
    paddingRight: 14,
  },
  accordionHeaderItem: {
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 24,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  accordionHeaderText: {
    fontSize: 24,
    textAlign: 'left',
  },
  accordionListElement: {
    padding: 2,
    paddingLeft: 50,
    paddingRight: 50,
  },
  accordionListElementText: {
    fontSize: 24,
    borderRadius: 8,
    backgroundColor: Colors.GrayAccent,
    padding: 10,
    textAlign: 'center',
    color: Colors.Font,
  },
});
