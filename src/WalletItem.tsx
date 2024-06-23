import {
  AnyAptosWallet,
  WalletReadyState,
  isRedirectable,
} from "@aptos-labs/wallet-adapter-core";
 
import { Dynamic } from "solid-js/web"
import { JSX, createContext, useContext } from "solid-js";
import { Slot } from "solid-slots";

import { useWallet } from "./useWallet";

export interface WalletItemProps {
  /** The wallet option to be displayed. */
  wallet: AnyAptosWallet;
  /** A callback to be invoked when the wallet is connected. */
  onConnect?: () => void;
  /** A class name for styling the wrapper element. */
  className?: string;
  /**
   * Whether to render as the child element instead of the default `div` provided.
   * All props will be merged into the child element.
   */
  asChild?: boolean;
  children?: JSX.Element;
}

export interface WalletItemElementProps {
  /** A class name for styling the element. */
  className?: string;
  /**
   * Whether to render as the child element instead of the default element provided.
   * All props will be merged into the child element.
   */
  asChild?: boolean;
  children?: JSX.Element;
}

const WalletItemContext = createContext<{
  wallet: AnyAptosWallet;
  connectWallet: () => void;
} | null>(null);


function WalletItemRoot(props: { ref?: any; wallet?: any; onConnect?: any; className?: any; asChild?: any; children?: any; }): JSX.Element {
  const { wallet, onConnect, className, asChild, children } = props;
  const { connect } = useWallet();
  const connectWallet = () => {
    connect(wallet.name);
    onConnect?.();
  };

  const isWalletReady =
    wallet.readyState === WalletReadyState.Installed ||
    wallet.readyState === WalletReadyState.Loadable;

  const mobileSupport =
    'deeplinkProvider' in wallet && wallet.deeplinkProvider;

  if (!isWalletReady && isRedirectable() && !mobileSupport) return null;

  const Component = asChild ? Slot : 'div';

  return (
    <WalletItemContext.Provider value={{ wallet, connectWallet }}>
      <Dynamic component={()=> 
        <Component ref={props.ref} class ={className}>
        {children}
        </Component>
      }  />    </WalletItemContext.Provider>
  );
}

WalletItemRoot.displayName = "WalletItem";


function WalletItemIcon(props: { ref?: any; className?: any; asChild?: any; children?: any; }): JSX.Element  {
  const { className, asChild, children } = props;
  const context = useContext(WalletItemContext);

  if (!context) {
    throw new Error("`WalletItem.Icon` must be used within `WalletItem`");
  }

  const Component = asChild ? Slot : 'img';

  return (
    <Dynamic component={()=><Component
      ref={props.ref}
      src={context.wallet.icon}
      alt={`${context.wallet.name} icon`}
      class={className}
    >
      {children} </Component>} />
    );
}
WalletItemIcon.displayName = "WalletItem.Icon";

function WalletItemName(props: { ref?: any; className?: any; asChild?: any; children?: any; }): JSX.Element  {
  const { className, asChild, children } = props;
  const context = useContext(WalletItemContext);

  if (!context) {
    throw new Error("`WalletItem.Name` must be used within `WalletItem`");
  }

  const Component = asChild ? Slot : 'div';

  return (
    <Dynamic component={()=><Component ref={props.ref} class={className}>
      {children ?? context.wallet.name}
    </Component>}  />
  );
}
WalletItemName.displayName = "WalletItem.Name";

function WalletItemConnectButton(props: { ref?: any; className?: any; asChild?: any; children?: any; }): JSX.Element  {
  const { className, asChild, children } = props;
  const context = useContext(WalletItemContext);

  if (!context) {
    throw new Error("`WalletItem.ConnectButton` must be used within `WalletItem`");
  }

  const Component = asChild ? Slot : 'button';

  return (
    <Dynamic component={()=><Component ref={props.ref} class ={className} onClick={context.connectWallet}>
      {children ?? "Connect"}</Component>}/> 
  );
}
WalletItemConnectButton.displayName = "WalletItem.ConnectButton";

function WalletItemInstallLink(props: { ref?: any; className?: any; asChild?: any; children?: any; }): JSX.Element  {
  const { className, asChild, children } = props;
  const context = useContext(WalletItemContext);

  if (!context) {
    throw new Error("`WalletItem.InstallLink` must be used within `WalletItem`");
  }

  const Component = asChild ? Slot : 'a';

  return (
    <Dynamic component={()=> <Component ref={props.ref}
    class ={className}
    href={context.wallet.url}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children ?? "Install"}</Component>} /> 
  )
}
WalletItemInstallLink.displayName = "WalletItem.InstallLink";

/** A headless component for rendering a wallet option's name, icon, and either connect button or install link. */
export const WalletItem = Object.assign(WalletItemRoot, {
  Icon: WalletItemIcon,
  Name: WalletItemName,
  ConnectButton: WalletItemConnectButton,
  InstallLink: WalletItemInstallLink,
});
