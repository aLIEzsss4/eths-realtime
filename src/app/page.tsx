import { ConnectButton } from '@rainbow-me/rainbowkit';
import RealtimeUpdates from "./compoents/RealtimeUpdates";

function Page() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 12,
      }}
    >
      {/* <ConnectButton /> */}
      <RealtimeUpdates />
    </div>
  );
}

export default Page;
