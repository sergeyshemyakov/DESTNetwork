import { HeroSvg } from "@/components/hero-svg";
import { Button } from "@nextui-org/button";
import { Block } from "@/components/Block";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-start gap-16 md:gap-24 py-8">
      <div className="flex flex-row items-center">
        <div>
          <h1 className="header-text text-5xl max-w-xl mb-6">
            Welcome to Dest 👋 <br />
            Decentralized Stashing Network
          </h1>
          <p className="mb-8 text-gray-500 text-lg">
            Secure resources and build community aid by participating in our
            innovative stash campaigns, strengthening your community's
            resilience and preparedness.
          </p>
          <Button color="primary" variant="shadow" radius="full" size="lg">
            Exprole campaigns
          </Button>
        </div>
        <div>
          <HeroSvg />
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex flex-row justify-center">
          <p className="text-xl text-gray-500 text-center max-w-[600px]">
            Dest is a decentralized platform that encourages individuals to
            securely stash resources, fostering community aid and resilience.
          </p>
        </div>
        <div className="flex gap-8 mt-8">
          {siteConfig.mainCards.map((item, index) => (
            <Card
              key={item.text + index}
              className="max-w-[340px] p-1 pb-4"
              isBlurred
            >
              <CardHeader className="justify-between">
                <div className="flex gap-5">
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-xl font-bold header-text">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="px-3 py-0 text-small text-default-400">
                <p className="text-gray-500">{item.text}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <Block
        title="Stash and Earn Rewards"
        subtitle="Each stashing activity offers unique rewards based on size and community need."
      >
        <ol>
          <li>1. Gather the required resources.</li>
          <li>2. Take a clear photo of the resources.</li>
          <li> 3. Enable location services on your device.</li>
          <li>
            4. Submit the photo and geolocation through the submission form.
          </li>
          <li>
            5. Submissions by users verified with WorldID cannot be disputed."
          </li>
        </ol>
      </Block>
    </section>
  );
}
