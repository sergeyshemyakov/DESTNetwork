"use client";

import { Block } from "@/components/Block";
import { Image, Tab, Tabs } from "@nextui-org/react";
import {
  FullscreenControl,
  GeolocateControl,
  Map,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
} from "react-map-gl";
import { Key, useEffect, useMemo, useState } from "react";
import { API } from "@/config/api";
import Pin from "../../components/Pin";
import { SubmissionsStates } from "@/config/categories";
import { AcceptSubmission } from "./AcceptSubmission";
import { DeclineSubmission } from "./DeclineSubmission";
import { useDestAccount } from "@/hooks/useDestAccount";
import { ReopenDispute } from "./ReopenDispute";
import { BiLoaderAlt } from "react-icons/bi";

export default function Submissions({ campaignId }: { campaignId: string }) {
  const { isConnected, account } = useDestAccount();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [popupInfo, setPopupInfo] = useState<Submission | null>(null);
  const [activeTab, setActiveTab] = useState<string>("verify");
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(false);

  const getData = async () => {
    if (!isConnected) return;

    setIsSubmissionsLoading(true);
    const { data } = await API.get(
      `submissions?campaign_id=${campaignId}&user_address=${account.address}`
    );
    setSubmissions(data);
    // setIsSubmissionsLoading(false);
  };

  useEffect(() => {
    if (isConnected) {
      getData();
    }
  }, [isConnected]);

  const pins = useMemo(
    () =>
      submissions
        .filter((sub) => SubmissionsStates[sub.state] === activeTab)
        .map((sub) => (
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
    [submissions, activeTab]
  );

  const onTabChange = (tab: Key) => {
    setActiveTab(tab.toString());
    setPopupInfo(null);
  };

  return (
    <Block
      title={
        <div className="flex gap-1 flex-col mb-6">
          <h2 className="header-text text-6xl flex gap-4 items-center">
            Submissions
          </h2>
          <p className="text-primary italic">(Campaign: {campaignId})</p>
        </div>
      }
    >
      <div className="flex justify-between items-end">
        <p className="text-default-500 text-lg max-w-[600px]">
          Here you can view all submissions, verify other users' submissions,
          and dispute any incorrect entries. Your active participation helps
          ensure the accuracy and reliability of the resources stashed for
          community aid.
        </p>
        <Tabs
          variant="bordered"
          size="lg"
          aria-label="Submissions"
          color="primary"
          onSelectionChange={onTabChange}
        >
          <Tab key="verify" title="To Verify"></Tab>
          <Tab key="disputed" title="Disputed"></Tab>
          <Tab key="finalized" title="Finalized"></Tab>
          <Tab key="resolved" title="Resolved"></Tab>
        </Tabs>
      </div>
      <div className="relative flex w-full flex-col mt-8">
        {isSubmissionsLoading && (
          <div className="absolute flex justify-center items-center w-full h-full bg-background opacity-80">
            <p className="flex text-lg items-center">
              <span className="animate-spin mr-2">
                <BiLoaderAlt />
              </span>{" "}
              Loading...
            </p>
          </div>
        )}
        <div className="w-full rounded-lg overflow-hidden">
          <Map
            initialViewState={{
              latitude: 40,
              longitude: -100,
              zoom: 3.5,
              bearing: 0,
              pitch: 0,
            }}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_BOX_KEY}
            style={{ width: "100%", height: 500 }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            <GeolocateControl position="top-left" />
            <FullscreenControl position="top-left" />
            <NavigationControl position="top-left" />
            <ScaleControl />

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
                    src={`${process.env.NEXT_PUBLIC_BASE_API_URL}${popupInfo.photo_url}`}
                  />
                </div>

                <p className="text-gray-900 py-2">{popupInfo.description}</p>

                {activeTab === "verify" && popupInfo.status === 0 && (
                  <div className="flex gap-2">
                    <AcceptSubmission submission={popupInfo} />
                    <DeclineSubmission submission={popupInfo} />
                  </div>
                )}

                {activeTab === "finalized" && (
                  <ReopenDispute submission={popupInfo} onSuccess={getData} />
                )}
              </Popup>
            )}
          </Map>
        </div>
      </div>
    </Block>
  );
}
