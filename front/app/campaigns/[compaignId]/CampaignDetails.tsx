"use client";

import {
  Chip,
  Textarea,
  Image,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ModalContent,
  Link,
} from "@nextui-org/react";
import CustomFileInput from "../components/CustomInput";
import { Map, MapRef, Marker } from "react-map-gl";
import { FC, useEffect, useRef, useState } from "react";
import Pin from "../components/Pin";
import { categories } from "@/config/categories";
import { Block } from "@/components/Block";
import { formatCoordinate, formatNumber } from "@/utils/formaters";
import { FaInfoCircle } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { API } from "@/config/api";
import NavLink from "next/link";
import { useWalletClient } from "wagmi";

export const CampaignDetails: FC<{ campaign: StashCampaign }> = ({
  campaign,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const wallet = useWalletClient();
  const mapRef = useRef<MapRef>(null);

  const [isLoading, setIsLoading] = useState(false);
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
    if (!photo || !location?.lat || !location.long || !description) {
      // todo: add validaton message to the form
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", photo);

    try {
      const [enSubmissionDescription, enPhoto] = await Promise.all([
        API.post("descriptions", { content: description }),
        API.post("photos/upload", formData),
      ]);

      const params = {
        photo: enPhoto.data.hash,
        description: enSubmissionDescription.data.hash,
        lat: formatCoordinate(location.lat),
        long: formatCoordinate(location.lat),
      };
      // Handle form submission logic here
      console.log(params);

      setIsLoading(false);
    } catch (e) {
      alert("Oooops. No success. try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (campaign && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });

          setTimeout(() => {
            mapRef.current?.fitBounds(
              [
                [campaign.top_left.long, campaign.top_left.lat],
                [campaign.bottom_right.long, campaign.bottom_right.lat],
              ],
              { duration: 1000 }
            );
          }, 100);
        },
        (error) => {
          console.error("Error obtaining location", error);
        }
      );
    }
  }, []);

  return (
    <div className="container">
      <Block
        hasMaxWidth={false}
        title={
          <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-6 items-center">
              <Image
                alt="category icon"
                height={60}
                radius="sm"
                src="/med.png"
                width={60}
              />
              <h2 className="header-text text-6xl">
                {categories[campaign.campaign_type]}
              </h2>
              <NavLink href={`/campaigns/${campaign.campaign_id}/submissions`}>
                <Button>View campaign submissions</Button>
              </NavLink>
            </div>
            <div className="flex gap-8 items-end">
              <p className="text-4xl text-primary">
                {campaign.reward}
                <span className="text-2xl">{campaign.token_symbol}</span>
              </p>

              <p className="text-lg">
                {campaign.remained_submissions} from {campaign.max_submissions}{" "}
                rewards available
              </p>

              <Link
                className="mb-0.5 cursor-pointer"
                color="foreground"
                onClick={onOpen}
              >
                <FaInfoCircle className="mr-2" /> Rules of submission
              </Link>
            </div>
          </div>
        }
      >
        <div className="flex gap-8 mt-6">
          <article className="prose dark:prose-invert">
            <ReactMarkdown>{campaign.description}</ReactMarkdown>
          </article>

          <div>
            <div className="max-w-[360px] max-h-[360px] rounded-lg overflow-hidden">
              <Map
                ref={mapRef}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_BOX_KEY}
                style={{ width: 360, height: 360 }}
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
            <p className="text-sm mb-2 mt-8">
              Drag a marker on map to adjust your location
            </p>
            <div className="flex flex-row gap-2">
              <Chip variant="dot" size="lg">
                Lat {location?.lat && formatNumber(location?.lat)}
              </Chip>
              <Chip variant="dot" size="lg">
                Long {location?.long && formatNumber(location?.long)}
              </Chip>
            </div>

            <div id="#submission-form" className="flex gap-4 max-w-md">
              <div className="w-full">
                <div className="my-6">
                  <CustomFileInput onFileChange={handlePhotoChange} />
                </div>
                <Textarea
                  labelPlacement="outside"
                  variant="bordered"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  label="Description"
                  className="my-6"
                />
              </div>
            </div>

            <div>
              <Button
                isLoading={isLoading}
                variant="shadow"
                color="primary"
                isDisabled={!wallet.isSuccess}
                disabled={!wallet.isSuccess}
                onClick={handleSubmit}
              >
                Submit stashing
              </Button>

              {!wallet.isSuccess && (
                <p className="mt-2 text-danger text-sm">
                  Please, connect your wallet before submission.
                </p>
              )}
            </div>
          </div>
        </div>
      </Block>

      <Modal size="md" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <h3 className="header-text">Rules of submission</h3>
              </ModalHeader>
              <ModalBody>
                <ul className="list-disc pl-3 pb-4">
                  <li>
                    Ensure that the resources are clearly visible and
                    identifiable in the photo.
                  </li>
                  <li>
                    The photo must be taken at the specified location of the
                    stash.
                  </li>
                  <li>
                    Only submit resources that match the campaign requirements.
                  </li>
                  <li>
                    Submissions will be reviewed and verified by the community.
                  </li>
                  <li>Verified submissions earn rewards</li>
                  <li>
                    Disputes can be raised for incorrect submissions, except for
                    those verified with{" "}
                    <Link target="_blank" href="https://worldcoin.org/world-id">
                      WorldID
                    </Link>
                  </li>
                </ul>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CampaignDetails;
