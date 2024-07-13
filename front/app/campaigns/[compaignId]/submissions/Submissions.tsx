"use client";

import { Block } from "@/components/Block";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
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
import { FaCheck, FaRetweet, FaTimes } from "react-icons/fa";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { SubmissionsStates } from "@/config/categories";
import { IoMdRefresh } from "react-icons/io";

export default function Submissions({ campaignId }: { campaignId: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { primaryWallet } = useDynamicContext();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [popupInfo, setPopupInfo] = useState<Submission | null>(null);
  const [activeTab, setActiveTab] = useState<string>("verify");
  const [description, setDescription] = useState("");
  const [isReopeningDispute, setIsReopeningDispute] = useState(false);
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(false);

  const getData = async () => {
    if (!primaryWallet?.address) return;

    setIsSubmissionsLoading(true);
    const { data } = await API.get(
      `submissions?campaign_id=${campaignId}&user_address=${primaryWallet?.address}`
    );
    setSubmissions(data);
    setIsSubmissionsLoading(false);
  };

  useEffect(() => {
    if (primaryWallet) {
      getData();
    }
  }, [primaryWallet]);

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

  const reopenDispute = async (e: any) => {
    e.preventDefault();
    setIsReopeningDispute(true);

    const { data: descriptionHash } = await API.post("descriptions", {
      content: description,
    });

    // TODO: web3
    console.log(descriptionHash.hash);

    await getData();
    setIsReopeningDispute(false);
    onClose();
    setPopupInfo(null);
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
      <div className="relative flex w-full flex-col mt-8">
        <Tabs
          className="mb-2"
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
                      startContent={<FaTimes />}
                    >
                      Decline
                    </Button>
                  </div>
                )}

                {activeTab === "finalized" && (
                  <Button
                    size="sm"
                    variant="bordered"
                    color="warning"
                    startContent={<FaRetweet />}
                    onClick={onOpen}
                  >
                    Reopen dispute
                  </Button>
                )}
              </Popup>
            )}
          </Map>
        </div>
      </div>

      <Modal backdrop="blur" size="md" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3 className="header-text">Reopen dispute</h3>
              </ModalHeader>
              <ModalBody className="pb-4">
                <form onSubmit={reopenDispute}>
                  <Textarea
                    required
                    labelPlacement="outside"
                    variant="bordered"
                    rows={4}
                    value={description}
                    label="Why do you want to reopen dispute?"
                    className="mb-4"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="light"
                      disabled={isReopeningDispute}
                      type="button"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      isLoading={isReopeningDispute}
                      disabled={isReopeningDispute}
                      type="submit"
                    >
                      Reopen
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </Block>
  );
}
