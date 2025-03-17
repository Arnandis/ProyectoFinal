import { registerRootComponent } from 'expo';

import App from './App';
import Finanzas from './Screens/Finanzas';
import Tiempo from './Screens/Tiempo';
import Login from './Screens/Login';
import GoalScreen from './Screens/GoalScreen';
import Registro from './Screens/Registro';
import RankingScreen from './Screens/RankingScreen';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);


