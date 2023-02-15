/* eslint-disable global-require */
import React, {
  useEffect,
  useReducer,
  useRef,
  useState,
  useContext,
} from 'react';
import {
  RefreshControl,
  KeyboardAvoidingView,
  TextInput,
  Platform,
} from 'react-native';
import {io} from 'socket.io-client';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/core';
import {Styles} from './Stylesheets/Stylesheets';
import {
  HeaderText,
  InputContainer,
  LoginViewContainer,
  StyledTextInput,
  ButtonsContainer,
  ServerScrollView,
  SecondaryText,
  StyledBlurView,
} from './LoginView.Components';
import AccountModal from './AccountModal';
import CustomizedButton from './CustomizedButton';
import ServerEntry from './ServerEntry/ServerEntry';
import ManualIP from './ManualIP/ManualIP';
import {LoginButton, loginStates} from './LoginView.LoginButton';
import useLocalStorage from './useLocalStorage';
import {
  server,
  serversReducer,
  connectionStates,
  ActionState,
} from './ServersReducer';
import {MainStackParams} from '../../navigation/Params';
import {SocketContext} from '../../context/SocketContext';

type loginScreenProp = StackNavigationProp<MainStackParams, 'Login'>;

const LoginView = (): JSX.Element => {
  const {Background} = Styles;
  const {SetConnected, DisconnectAll, AddServers, DeleteServer, LoadServers} =
    ActionState;

  const [email, setEmail] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');
  const emailInputRef = useRef() as React.MutableRefObject<TextInput>;
  const pwdInputRef = useRef() as React.MutableRefObject<TextInput>;

  const [fetchServers, saveServers] = useLocalStorage<server[]>('servers');
  const [selectedServer, setSelectedServer] = useState<server | null>(null);
  const [servers, srvDispatch] = useReducer(serversReducer, []);

  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isRefreshing, setRefreshing] = useState<boolean>(false);
  const [loginState, setLoginState] = useState<number>(loginStates.disabled);

  const {socket, setSocket} = useContext(SocketContext);

  const navigation = useNavigation<loginScreenProp>();

  useEffect(() => {
    const fetchServersAsync = async () => {
      const temp = await fetchServers();
      if (temp) {
        srvDispatch({
          type: LoadServers,
          servers: temp,
        });
      }
    };
    fetchServersAsync();

    return () => {
      srvDispatch({type: DisconnectAll});
    };
  }, []);

  useEffect(() => {
    const saveServersAsync = async () => {
      await saveServers(servers);
    };
    if (servers) {
      saveServersAsync();
    }
  }, [servers]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setSelectedServer(null);

    await setTimeout(() => setRefreshing(false), 1500);
  };

  const manualIPSelection = (ip: string) => {
    if (ip !== '') {
      const newServer: server[] = [
        {
          name: 'server '.concat(servers.length.toString()),
          ip,
          key: servers.length,
          status: connectionStates.none,
        },
      ];
      srvDispatch({
        type: AddServers,
        servers: newServer,
      });
    }
  };

  const handleLoginResponse = (response: boolean) => {
    if (response) {
      setLoginState(loginStates.loginSuccess);
      navigation.navigate('Doors', {email});
    } else {
      setLoginState(loginStates.loginFailed);
      setTimeout(() => setLoginState(loginStates.enabled), 3000);
    }
  };

  const handleConnection = (passedServer: server) => {
    const {ip} = passedServer;

    setLoginState(loginStates.disabled);

    if (ip && ip !== '') {
      const address = 'http://'.concat(ip).concat(':4000');
      const tempsocket = io(address, {transports: ['websocket']});

      tempsocket.on('connect', () => {
        setLoginState(loginStates.enabled);
        srvDispatch({type: SetConnected, server: passedServer});
      });
      tempsocket.on('disconnect', () => {
        setLoginState(loginStates.disabled);
        srvDispatch({type: DisconnectAll});
      });
      setSocket(tempsocket);
    }
  };

  const handleLogin = async () => {
    if (socket.connected) {
      setLoginState(loginStates.loading);
      socket.on('loginRequestRes', data => {
        handleLoginResponse(data);
      });
      setTimeout(
        () => socket.emit('loginRequest', {email, password: pwd}),
        600,
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="position"
      style={Background}
      contentContainerStyle={{flex: 1}}
      keyboardVerticalOffset={-100}>
      {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }}> */}
      <LoginViewContainer>
        <HeaderText>DAS</HeaderText>

        <ServerScrollView
          refreshControl={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={async () => handleRefresh()}
            />
          }
          contentContainerStyle={{alignItems: 'center'}}>
          <SecondaryText
            style={{
              marginTop: 8,
              marginBottom: 8,
            }}>
            Select a server to log into:
          </SecondaryText>
          {servers.map(element => {
            return (
              <ServerEntry
                key={element.key}
                description={element.name}
                ip={element.ip}
                isSelected={element === selectedServer}
                onPress={() => {
                  setSelectedServer(element);
                  handleConnection(element);
                }}
                onLongPress={() =>
                  srvDispatch({
                    type: DeleteServer,
                    server: element,
                  })
                }
                connectionStatus={element.status}
              />
            );
          })}
          <ManualIP connectionHandler={manualIPSelection} />
        </ServerScrollView>

        <InputContainer>
          <StyledTextInput
            ref={emailInputRef}
            autoCompleteType="email"
            keyboardType="email-address"
            placeholder="Email address..."
            onChangeText={setEmail}
            editable={loginState === 0}
          />
          <StyledTextInput
            ref={pwdInputRef}
            autoCompleteType="password"
            keyboardType="default"
            secureTextEntry
            placeholder="Password..."
            onChangeText={setPwd}
            editable={loginState === 0}
          />
        </InputContainer>

        <ButtonsContainer>
          <LoginButton onPress={handleLogin} state={loginState} />
          <CustomizedButton
            text="Need account?"
            onPress={() => setModalVisible(true)}
          />
        </ButtonsContainer>
        {isModalVisible && (
          <StyledBlurView
            blurType={Platform.OS === 'ios' ? 'regular' : 'dark'}
            blurAmount={1}
          />
        )}
        <AccountModal
          visible={isModalVisible}
          handleClose={() => setModalVisible(false)}
        />
      </LoginViewContainer>
      {/* </ScrollView> */}
    </KeyboardAvoidingView>
  );
};

export default LoginView;
