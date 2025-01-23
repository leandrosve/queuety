import "./assets/css/app.css";
import {
  Flex,
  Spinner,
  Text,
  Icon,
  Tag,
  Link,
} from "@chakra-ui/react";
import "./i18n/i18n";
import { useCallback, useState, useEffect } from "react";
import { lazy } from "react";
import DeviceSelection, {
  DeviceType,
} from "./components/app/shared/device/DeviceSelection";
import StorageUtils, { StorageKey } from "./utils/StorageUtils";
import AuthUtils from "./utils/AuthUtils";
import RoomSwitchWarning from "./components/app/shared/auth/RoomSwitchWarning";
import StatusService from "./services/api/StatusService";
import { Navigate } from "react-router-dom";
import GlassContainer from "./components/common/glass/GlassContainer";
import useLayoutBackdrop from "./hooks/layout/useLayoutBackdrop";
import { LayoutBackdropPicture } from "./context/LayoutContext";
import BrandIcon from "./assets/images/BrandIcon";
import RenderIcon from "./assets/icons/RenderIcon";
import { Trans } from "react-i18next";
import { BsClockFill, BsInfoCircleFill } from "react-icons/bs";
import i18next, { t } from "i18next";
import SelectMenu from "./components/common/SelectMenu";
import { LuLanguages } from "react-icons/lu";
import languages from "./static/languages";
const DesktopAppLazy = lazy(
  () => import("./components/app/desktop/DesktopApp")
);
const MobileAppLazy = lazy(() => import("./components/app/mobile/MobileApp"));

enum ServerStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  WAITING = "waiting",
}

const shouldDisplayWarning = () => {
  const authParam = AuthUtils.getAuthParam();
  const deviceType = StorageUtils.get(StorageKey.DEVICE);
  const hostAuthRoomId = StorageUtils.get(StorageKey.AUTH_ROOM_ID);
  const mobileAuthRoomId = StorageUtils.get(StorageKey.MOBILE_AUTH_ROOM_ID);
  const playerRoomId = StorageUtils.get(StorageKey.PLAYER_ROOM_ID);
  if (!authParam || !playerRoomId) return false;
  if (mobileAuthRoomId && mobileAuthRoomId !== authParam) return true;
  if (deviceType == DeviceType.DESKTOP && authParam !== hostAuthRoomId)
    return true;
  return false;
};

const PICTURES = [
  LayoutBackdropPicture.DESKTOP_WELCOME,
  LayoutBackdropPicture.DEVICE_SELECTION,
  LayoutBackdropPicture.MOBILE_CONNECTION,
];

export const AppContent = () => {
  const [deviceType, setDeviceType] = useState<DeviceType | null>(
    StorageUtils.get(StorageKey.DEVICE) as DeviceType
  );
  const [showWarning] = useState<boolean>(shouldDisplayWarning());
  const [serverStatus, setServerStatus] = useState<ServerStatus>(
    ServerStatus.WAITING
  );

  const [pictureRotation, setPictureRotation] = useState(-1);

  useLayoutBackdrop(true, PICTURES[pictureRotation]);
  useEffect(() => {
    const interval = setInterval(
      () => setPictureRotation((p) => (p + 1) % 3),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  const [showServerInitializing, setShowServerInitializing] =
    useState<boolean>(false);

  const handleBack = useCallback(() => {
    if (deviceType == DeviceType.DESKTOP) {
      StorageUtils.clearAll({
        exceptions: [
          StorageKey.SETTINGS,
          StorageKey.USER_ID,
          StorageKey.CONNECTION_SETTINGS,
        ],
      });
    } else {
      StorageUtils.clear([StorageKey.DEVICE]);
    }
    setDeviceType(null);
  }, [deviceType]);

  useEffect(() => {
    const authParam = AuthUtils.getAuthParam();
    const hostAuthRoomId = StorageUtils.get(StorageKey.AUTH_ROOM_ID);
    const playerRoomId = StorageUtils.get(StorageKey.PLAYER_ROOM_ID);
    if (authParam && !playerRoomId && deviceType !== DeviceType.DESKTOP) {
      setDeviceType(DeviceType.MOBILE);
      StorageUtils.setRaw(StorageKey.DEVICE, DeviceType.MOBILE);
    }
    if (authParam && deviceType == DeviceType.DESKTOP) {
      if (authParam === hostAuthRoomId) {
        history.replaceState({}, document.title, "/app");
        return;
      }
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowServerInitializing(true);
    }, 3000);
  }, []);

  useEffect(() => {
    StatusService.getStatus().then((res) => {
      setServerStatus(
        !res.hasError ? ServerStatus.ONLINE : ServerStatus.OFFLINE
      );
    });
  }, []);

  if (serverStatus === ServerStatus.WAITING)
    return (
      <Flex
        alignItems="center"
        justifyContent="center"
        height="100vh"
        width="100vw"
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          direction="column"
          gap={5}
          p={5}
          textAlign="center"
        >
          <Spinner size="lg" />
          {showServerInitializing && (
            <GlassContainer
              display="flex"
              flexDirection="column"
              position="absolute"
              top={10}
              padding={5}
              borderRadius="md"
              border="1px solid"
              borderColor="borders.100"
              maxWidth="100vw"
              width="max-content"
              className="section-fade-in"
            >
             
              <Flex alignItems="center" justifyContent="center" margin={4}>
                <Icon
                  as={BrandIcon}
                  boxSize="2.3rem"
                  _dark={{
                    filter: "drop-shadow(1px 1px 15px var(--text-300))",
                  }}
                />
              </Flex>
              <>
                <Flex wrap="wrap" alignItems="end" justifyContent="center">
                  <Text as="h4" fontWeight="bold">
                   {t('startup.initializing')}{" "}
                  </Text>
                  <Flex mb=".3rem" ml={1}>
                    <div className="dots-loader" />
                  </Flex>
                </Flex>
                <Text   fontWeight='bold' fontSize='sm'>
                <Icon aria-hidden as={BsClockFill} display='inline' width={4} height={4} mb='-2px'  mr={1} overflow={'visible'}/>
                {t('startup.wait')}
                </Text>
                <Text fontSize="sm" color="text.300">
                  <Icon aria-hidden as={BsInfoCircleFill} display='inline' width={4} height={4} mb='-2px'  mr={1} overflow={'visible'}/>
                  <Trans
                    i18nKey={"startup.info"}
                    components={[<RenderLink />]}
                  />
                </Text>
                <Flex mt={3}>
                <SelectMenu
                triggerWidth='100%'
                icon={<LuLanguages />}
                value={i18next.language}
                onChange={(v) => i18next.changeLanguage(v)}
                options={languages}
              /></Flex>
              </>
            </GlassContainer>
          )}
        </Flex>
      </Flex>
    );
  if (serverStatus === ServerStatus.OFFLINE) {
    return <Navigate to="/maintenance" />;
  }

  if (showWarning) return <RoomSwitchWarning />;
  if (!deviceType)
    return <DeviceSelection onSelected={(type) => setDeviceType(type)} />;
  if (deviceType === DeviceType.DESKTOP)
    return <DesktopAppLazy onGoBack={handleBack} />;
  return <MobileAppLazy onBack={handleBack} />;
};

const RenderLink = () => (
  <Link target="_blank" href={`https://render.com`} flexShrink={0}>
    <Tag
      size="sm"
      gap={1}
      alignItems="center"
      justifyContent="center"
      variant="subtle"
      marginX={1}
    >
      <Icon
        _dark={{
          filter: "drop-shadow(1px 1px 15px var(--text-300))",
        }}
        as={RenderIcon}
      />
      render.com
    </Tag>
  </Link>
);
export default AppContent;
