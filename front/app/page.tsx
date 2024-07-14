import { HeroSvg } from "@/components/hero-svg";
import { Button } from "@nextui-org/button";
import { Block } from "@/components/Block";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-start gap-16 md:gap-32 py-8">
      <div className="flex flex-row items-center">
        <div>
          <h1 className="header-text text-5xl max-w-xl mb-6">
            Welcome to Dest 👋 <br />
            Decentralized <span className="text-primary">Stashing</span> Network
          </h1>
          <p className="mb-8 text-gray-500 text-lg">
            Secure resources and build community aid by participating in our
            innovative stash campaigns, strengthening your community's
            resilience and preparedness.
          </p>
          <Link href="/campaigns">
            <Button color="primary" variant="shadow" radius="full" size="lg">
              Exprole stash campaigns
            </Button>
          </Link>
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
            <Card key={item.text + index} className="w-full p-1 pb-4" isBlurred>
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
                <p className="text-gray-500 text-lg">{item.text}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <Block
        title="Why DEST Network?"
        subtitle="Targeting High-Risk Areas with Innovative Technology"
      >
        <div className="flex mt-8 gap-8">
          <Card className="p-1 pb-4 w-full" isBlurred>
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-2xl font-bold header-text">
                    High Risk, High Adoption
                  </h4>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
              <p className="text-gray-500 text-lg">
                Southeast Asian countries like India, Indonesia, and the
                Philippines face severe natural disaster risks but also lead in
                blockchain adoption, recognizing its value beyond mere
                speculation.
              </p>
            </CardBody>
          </Card>
          <Card className="p-1 pb-4 w-full" isBlurred>
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-2xl font-bold header-text">
                    Mitigating Climate Change Impact
                  </h4>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
              <p className="text-gray-500 text-lg">
                With climate change increasing the frequency of natural
                disasters, proactive preparation in vulnerable regions is
                crucial. Destnet offers a practical and innovative use-case for
                blockchain technology to enhance community resilience.
              </p>
            </CardBody>
          </Card>
        </div>
      </Block>

      <Block title="How It Works?" subtitle="Creating and Verifying Stashes">
        <div className="flex mt-8 gap-8">
          <Card className="p-1 pb-4 w-full" isBlurred>
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-2xl font-bold header-text">
                    Incentivizing Stashes for Readiness
                  </h4>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
              <p className="text-gray-500 text-lg">
                Governments or NGOs fund on-chain incentives, aligning their
                goal of protecting people with community interests. Rewards are
                about 30% of the item value, with specific stashing guidelines
                defined by these organizations.
              </p>
            </CardBody>
          </Card>
          <Card className="p-1 pb-4 w-full" isBlurred>
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-2xl font-bold header-text">
                    Geo-Verifiable Submissions for Transparency
                  </h4>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
              <p className="text-gray-500 text-lg">
                Users create stashes and provide geo-verifiable photos,
                including landmarks and unique IDs on the items. A minimum
                distance between stashes ensures widespread coverage.
              </p>
            </CardBody>
          </Card>

          <Card className="p-1 pb-4 w-full" isBlurred>
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-2xl font-bold header-text">
                    Social Consensus for Verification
                  </h4>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
              <p className="text-gray-500 text-lg">
                Users verify three other submissions to earn their rewards. All
                submissions are publicly visible, allowing anyone to monitor and
                dispute if necessary. Consensus is achieved through majority
                votes in multiple rounds, with correct votes rewarded and
                incorrect ones penalized.
              </p>
            </CardBody>
          </Card>
        </div>
      </Block>

      <Block
        title="What you can do?"
        subtitle="Engage in Stash Creation and Verification"
      >
        <div className="flex mt-8 gap-8">
          <Card className="p-1 pb-4 w-full" isBlurred>
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-2xl font-bold header-text">
                    Create Stash Campaigns with Clear Guidelines
                  </h4>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
              <p className="text-gray-500 text-lg">
                Anyone can initiate a campaign, defining the area, reward per
                submission, and maximum number of submissions. Rewards can be in
                any ERC-20 token.
              </p>
            </CardBody>
          </Card>
          <Card className="p-1 pb-4 w-full" isBlurred>
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-2xl font-bold header-text">
                    Submit Stashes with Detailed Information
                  </h4>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
              <p className="text-gray-500 text-lg">
                Users submit photos, descriptions, and coordinates of their
                stashes. Information is stored on our server, with a hash
                recorded on the blockchain. Rewards are allocated immediately
                but locked for about three months, requiring users to complete
                all necessary verifications.
              </p>
            </CardBody>
          </Card>

          <Card className="p-1 pb-4 w-full" isBlurred>
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-2xl font-bold header-text">
                    Participate in the Verification Process
                  </h4>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
              <p className="text-gray-500 text-lg">
                Verifiers are randomly selected among users. If a vote isn’t
                unanimous, new verifiers are chosen. Disputes are allowed for
                one month after voting, requiring a deposit from the disputing
                party. Incorrect votes result in penalties, with rewards
                redistributed to correct voters.
              </p>
            </CardBody>
          </Card>
        </div>
      </Block>

      <Block
        title="Join DEST Network Today"
        subtitle="Strengthen Community Preparedness and Resilience"
      >
        <div className="flex mt-8 gap-8">
          <Card className="p-1 pb-4 w-full" isBlurred>
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-2xl font-bold header-text">
                    Boost Disaster Preparedness Effectively
                  </h4>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
              <p className="text-gray-500 text-lg">
                Destnet provides a reliable way to enhance disaster readiness in
                areas that need it most, combining community efforts with
                blockchain’s security and transparency.
              </p>
            </CardBody>
          </Card>

          <Card className="p-1 pb-4 w-full" isBlurred>
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-2xl font-bold header-text">
                    Contribute to a Safer World
                  </h4>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
              <p className="text-gray-500 text-lg">
                Whether you’re creating campaigns, submitting stashes, or
                verifying others, your participation helps build a safer, more
                prepared world. Join Destnet and contribute to a decentralized,
                community-driven approach to disaster preparedness.
              </p>
            </CardBody>
          </Card>
        </div>
      </Block>

      <Link href="/campaigns">
        <Button color="primary" variant="shadow" radius="full" size="lg">
          Explore stash campaigns
        </Button>
      </Link>
    </section>
  );
}
