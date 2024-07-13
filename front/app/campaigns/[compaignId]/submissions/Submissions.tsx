"use client";

import { Block } from "@/components/Block";
import { Button, Image, Tab, Tabs } from "@nextui-org/react";
import { Map, Marker, Popup } from "react-map-gl";
import { Key, useContext, useEffect, useMemo, useState } from "react";
import { API } from "@/config/api";
import Pin from "../../components/Pin";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export default function Submissions({ campaignId }: { campaignId: string }) {
  const { primaryWallet } = useDynamicContext();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [popupInfo, setPopupInfo] = useState<Submission | null>(null);
  const [activeTab, setActiveTab] = useState<string>("verify");

  const getData = async () => {
    const { data } = await API.get(`submissions?campaignId=${campaignId}`);
    setSubmissions(data);
  };

  useEffect(() => {
    if (primaryWallet) {
      getData();
    }
  }, [primaryWallet]);

  const pins = useMemo(
    () =>
      submissions.map((sub) => (
        <Marker
          key={`marker-${sub.id}`}
          longitude={sub.long}
          latitude={sub.lat}
          anchor="bottom"
          onClick={(e: any) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(sub);
          }}
        >
          <Pin />
        </Marker>
      )),
    [submissions]
  );

  const onTabChange = (tab: Key) => {
    console.log(tab);
    setActiveTab(tab.toString());
  };

  return (
    <Block
      title={`${campaignId} submissions`}
      subtitle={
        <p className="text-default-500 text-lg">
          Here you can view all submissions, verify other users' submissions,
          and dispute any incorrect entries. Your active participation helps
          ensure the accuracy and reliability of the resources stashed for
          community aid.
        </p>
      }
    >
      <div className="flex w-full flex-col mt-8">
        <Tabs
          className="mb-2"
          size="lg"
          aria-label="Submissions"
          color="primary"
          onSelectionChange={onTabChange}
        >
          <Tab key="verify" title="To Verify"></Tab>
          <Tab key="disputed" title="Disputed"></Tab>
          <Tab key="finalized" title="Finilized"></Tab>
          <Tab key="resolved" title="Resolved"></Tab>
        </Tabs>

        <div className="w-full rounded-lg overflow-hidden">
          <Map
            initialViewState={{
              latitude: 40,
              longitude: -100,
              zoom: 3.5,
              bearing: 0,
              pitch: 0,
            }}
            mapboxAccessToken="pk.eyJ1IjoianVzdGVyZW1hIiwiYSI6ImNseWFqd3hhdDA5ZjIyaXIydDRta3V5aHUifQ.cfW4FtH7DCJ4tzdQluhAew"
            style={{ width: "100%", height: 500 }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            {/* <GeolocateControl position="top-left" />
          <FullscreenControl position="top-left" />
          <NavigationControl position="top-left" /> */}
            {/* <ScaleControl /> */}

            {pins}

            {popupInfo && (
              <Popup
                closeButton={false}
                anchor="top"
                longitude={Number(popupInfo.long)}
                latitude={Number(popupInfo.lat)}
                onClose={() => setPopupInfo(null)}
              >
                <div className="w-full max-w-[180px]">
                  <Image
                    width={"100%"}
                    src={`https://dest-network-8617a767d79b.herokuapp.com${popupInfo.photo_url}`}
                  />
                </div>

                <p className="text-gray-900 py-2">{popupInfo.description}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="bordered"
                    color="success"
                    startContent={<FaCheck />}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="bordered"
                    color="danger"
                    startContent={<ImCross />}
                  >
                    Decline
                  </Button>
                </div>
              </Popup>
            )}
          </Map>
        </div>
      </div>
    </Block>
  );
}
