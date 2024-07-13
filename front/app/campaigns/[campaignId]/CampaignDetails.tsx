"use client";
import { Chip, Textarea, Image, Button } from "@nextui-org/react";
import CustomFileInput from "../components/CustomInput";
import { Map, MapRef, Marker } from "react-map-gl";
import { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import Pin from "../components/Pin";
import { categories } from "@/config/categories";
import { Block } from "@/components/Block";
import { formatNumber } from "@/utils/formaters";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export const CampaignDetails: FC<{ campaign: StashCampaign }> = ({
  campaign,
}) => {
  const { primaryWallet } = useDynamicContext();
  const mapRef = useRef<MapRef>(null);

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
    console.log("in");
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

  useEffect(() => {
    if (campaign && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position.coords);
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
          }, 300);
        },
        (error) => {
          console.error("Error obtaining location", error);
        }
      );
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Block
        title={
          <div className="flex gap-4 items-center">
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
          </div>
        }
      >
        <div className="flex gap-8">
          <div>
            <p className="">
              In this campaign, we aim to secure, store, and distribute
              essential medicines to underserved communities. Our mission is to
              bridge the gap in healthcare by providing vital medications that
              are often inaccessible to those in need. By establishing a
              reliable storage and distribution network, we ensure that critical
              medicines reach the hands of patients promptly and safely. This
              initiative focuses on maintaining the quality and efficacy of the
              medicines through proper storage conditions, including temperature
              control and inventory management. With your support, we can
              prevent medication shortages and improve health outcomes for
              countless individuals. Join us in this vital mission to safeguard
              health and save lives. Your contribution will help us purchase,
              store, and distribute medicines to those who need them most.
              Together, we can make a lasting impact on community health and
              well-being.
            </p>
            <h4 className="header-text mt-8 mb-2">Rules of Submission</h4>
            <ul>
              <li>
                Ensure that the resources are clearly visible and identifiable
                in the photo.
              </li>
              <li>
                The photo must be taken at the specified location of the stash.
              </li>
              <li>
                Only submit resources that match the campaign requirements.
              </li>
              <li>
                Submissions will be reviewed and verified by the community.
              </li>
              <li>
                Verified submissions earn rewards; disputes can be raised for
                incorrect submissions, except for those verified with WorldID."
              </li>
            </ul>
          </div>
          <div>
            <div className="max-w-[360px] max-h-[360px] rounded-lg overflow-hidden">
              <Map
                ref={mapRef}
                mapboxAccessToken="pk.eyJ1IjoianVzdGVyZW1hIiwiYSI6ImNseWFqd3hhdDA5ZjIyaXIydDRta3V5aHUifQ.cfW4FtH7DCJ4tzdQluhAew"
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
                variant="shadow"
                color="primary"
                isDisabled={!primaryWallet?.address}
                disabled={!primaryWallet?.address}
                onClick={handleSubmit}
              >
                Submit stashing
              </Button>
              {!primaryWallet?.address && (
                <p className="mt-2 text-danger text-sm">
                  Please, connect your wallet before submission.
                </p>
              )}
            </div>
          </div>
        </div>
      </Block>
    </div>
  );
};

export default CampaignDetails;
