"use client";
import {
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { CampaignCard } from "./CampaignCard";
import Map, { MapRef, Marker } from "react-map-gl";
import { useEffect, useRef, useState } from "react";
import Pin from "./Pin";
import axios from "axios";
import CustomFileInput from "./CustomInput";

interface CampaignListProps {
  campaigns: StashCampaign[];
}

const CampaignList: React.FC<CampaignListProps> = ({ campaigns }) => {
  const mapRef = useRef<MapRef>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeCard, setActiveCard] = useState<StashCampaign | null>(null);

  const [photo, setPhoto] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);

  const handlePhotoChange = (file: File | null) => {
    setPhoto(file);
  };

  const onMarkerDragEnd = (e: mapboxgl.MapMouseEvent) => {
    setLocation({
      lat: e.lngLat.lat,
      long: e.lngLat.lng,
    });
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    if (photo) {
      formData.append("image", photo);
    }

    const desc = await axios.post(
      "https://dest-network-8617a767d79b.herokuapp.com/api/descriptions",
      { content: description }
    );

    console.log(desc);

    const response = await axios.post(
      "https://dest-network-8617a767d79b.herokuapp.com/api/photos/upload",
      formData
    );

    console.log(response);

    // Handle form submission logic here
    console.log({ photo, description, location });
  };

  const onModalClose = () => {
    setActiveCard(null);
    onClose();
  };

  useEffect(() => {
    console.log("in");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position.coords);
          setLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obtaining location", error);
        }
      );
    }
  }, []);

  return (
    <>
      <div className="flex flex-wrap gap-8">
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.campaign_id}
            campaign={campaign}
            onDetails={() => {
              setActiveCard(campaign);
              onOpen();
              setTimeout(() => {
                mapRef.current?.fitBounds(
                  [
                    [campaign.top_left.long, campaign.top_left.lat],
                    [campaign.bottom_right.long, campaign.bottom_right.lat],
                  ],
                  { duration: 1000 }
                );
              }, 300);
            }}
          />
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={onModalClose} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-4 items-center">
                <Image
                  alt="nextui logo"
                  height={40}
                  radius="sm"
                  src="med.png"
                  width={40}
                />
                <h2 className="header-text text-2xl">
                  {activeCard?.description}
                </h2>
              </ModalHeader>
              <ModalBody>
                <p className="mb-2">
                  In this campaign, we aim to secure, store, and distribute
                  essential medicines to underserved communities. Our mission is
                  to bridge the gap in healthcare by providing vital medications
                  that are often inaccessible to those in need. By establishing
                  a reliable storage and distribution network, we ensure that
                  critical medicines reach the hands of patients promptly and
                  safely. This initiative focuses on maintaining the quality and
                  efficacy of the medicines through proper storage conditions,
                  including temperature control and inventory management. With
                  your support, we can prevent medication shortages and improve
                  health outcomes for countless individuals. Join us in this
                  vital mission to safeguard health and save lives. Your
                  contribution will help us purchase, store, and distribute
                  medicines to those who need them most. Together, we can make a
                  lasting impact on community health and well-being.
                </p>
                <div className="flex gap-4">
                  <div className="min-w-[600px] rounded-lg overflow-hidden">
                    <Map
                      ref={mapRef}
                      mapboxAccessToken="pk.eyJ1IjoianVzdGVyZW1hIiwiYSI6ImNseWFqd3hhdDA5ZjIyaXIydDRta3V5aHUifQ.cfW4FtH7DCJ4tzdQluhAew"
                      style={{ width: 600, height: 400 }}
                      mapStyle="mapbox://styles/mapbox/streets-v9"
                    >
                      {location && (
                        <Marker
                          longitude={location.long}
                          latitude={location.lat}
                          anchor="bottom"
                          draggable
                          onDragEnd={onMarkerDragEnd}
                        >
                          <Pin />
                        </Marker>
                      )}
                    </Map>
                  </div>

                  <div className="w-full">
                    <div className="coordinates-display">
                      <p>Latitude: {location?.lat}</p>
                      <p>Longitude: {location?.long}</p>
                      <p className="text-xs text-gray-500">
                        Drag a marker on map to adjust your location
                      </p>
                    </div>
                    <CustomFileInput onFileChange={handlePhotoChange} />
                    <Textarea
                      variant="bordered"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      label="Description"
                      className="my-4"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CampaignList;
