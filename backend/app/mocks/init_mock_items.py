import hashlib

from app.db import SessionLocal
from app.models import Description, Photo, StashCampaign, Submission, VerificationRequest

import os

session = SessionLocal()

description_1 = """# Task: Photograph Medications

## List of Medications

1. **Aspirin**
2. **Amoxicillin**
3. **Lisinopril**
4. **Atorvastatin**
5. **Metformin**

## Instructions for Photographing Medications

To ensure consistency and high quality of the photographs, please follow these guidelines:

### General Rules

1. **Lighting**: Ensure the area is well-lit. Natural light is preferable, but if using artificial light, avoid harsh shadows and glares.
2. **Background**: Use a plain, neutral background (white or light grey) to make the medication stand out.
3. **Focus**: Make sure the medication is in sharp focus. The text on the packaging should be clearly readable.
4. **Framing**: Center the medication in the frame. Leave some space around the edges to avoid cropping out any part of the medication or its packaging.
5. **Resolution**: Use a high-resolution camera or smartphone to ensure clarity and detail.
6. **Orientation**: Take photos in landscape mode unless the medication packaging is better suited for portrait mode.

### Example Photos

For reference, here are examples of how the photos should look:

- **Front View**: ![Front View Example](https://via.placeholder.com/300x200?text=Front+View)
- **Side View**: ![Side View Example](https://via.placeholder.com/300x200?text=Side+View)
- **Back View**: ![Back View Example](https://via.placeholder.com/300x200?text=Back+View)
- **Top View**: ![Top View Example](https://via.placeholder.com/300x200?text=Top+View)
- **Bottom View**: ![Bottom View Example](https://via.placeholder.com/300x200?text=Bottom+View)

By following these guidelines, you'll help ensure that we have high-quality images of each medication that can be used for various purposes, such as documentation, promotion, and inventory management.

Thank you for your attention to detail and cooperation!"""

description_2 = """# Task: Purchasing a Floating Boat for Natural Disasters

## Objective

Acquire a floating boat that can be used effectively in the event of natural disasters, such as floods or hurricanes. The boat should be capable of carrying essential supplies and several passengers safely.

## Criteria for Selection

To ensure the floating boat meets our needs, please evaluate and select a boat based on the following criteria:

### General Specifications

1. **Capacity**:
   - Minimum passenger capacity: 6 people.
   - Sufficient storage space for essential supplies (e.g., food, water, medical kits).

2. **Durability**:
   - Constructed from high-quality, durable materials to withstand harsh weather conditions.
   - Resistant to punctures and impacts.

3. **Maneuverability**:
   - Easy to navigate in floodwaters and through debris.
   - Equipped with oars or a reliable motor for propulsion.

4. **Portability**:
   - Lightweight and easy to transport when not in use.
   - Capable of being inflated and deflated quickly if it is an inflatable boat.

### Safety Features

1. **Stability**:
   - Stable design to prevent capsizing, even in turbulent waters.

2. **Life-saving Equipment**:
   - Equipped with life jackets for all passengers.
   - Includes safety ropes and a first aid kit.

3. **Visibility**:
   - Brightly colored for easy visibility in rescue operations.
   - Reflective strips for visibility in low-light conditions.

### Additional Considerations

1. **Cost**:
   - Reasonably priced without compromising on quality and safety features.
   - Within the allocated budget for emergency preparedness.

2. **Warranty**:
   - Includes a warranty or guarantee for a specified period.
   - Option for extended warranty if available.

3. **Reviews and Ratings**:
   - Positive reviews and high ratings from other users.
   - Recommended by experts in disaster preparedness and survival.

## Instructions for Purchase

1. **Research**:
   - Identify potential boats that meet the above criteria.
   - Gather information from reliable sources, such as product reviews, expert recommendations, and manufacturer specifications.

2. **Evaluation**:
   - Compare the options based on capacity, durability, maneuverability, portability, and safety features.
   - Consider additional factors such as cost, warranty, and user reviews.

3. **Selection**:
   - Select the best option that meets all criteria and fits within the budget.
   - Ensure the chosen boat is available for immediate purchase and delivery.

4. **Purchase**:
   - Proceed with the purchase through a reputable supplier or retailer.
   - Arrange for delivery to the specified location.

## Reporting

Once the purchase is complete, please provide the following information:

- **Details of the Selected Boat**:
  - Brand and model
  - Specifications
  - Price
  - Supplier/retailer details

- **Reasons for Selection**:
  - Justification for choosing this particular boat over others.

- **Receipt and Documentation**:
  - Purchase receipt
  - Warranty information
  - Any additional documentation provided by the supplier

## Deadline

Complete the purchase and submit the report by [specific deadline].

By following these guidelines, you will ensure we have a reliable and safe floating boat ready for use in the event of natural disasters, enhancing our emergency preparedness.

Thank you for your diligence and attention to this critical task!
"""

description_3 = "I bought this boat in walmart, looks good"

description_4 = "Used boat found on e-bay, 6 ppl"

description_5 = "Here is the photo of all requested medications, some of them are analogs"

description_1_model = Description(
    content=description_1,
    hash=hashlib.sha256(description_1.encode()).hexdigest()
)

description_2_model = Description(
    content=description_2,
    hash=hashlib.sha256(description_2.encode()).hexdigest()
)

description_3_model = Description(
    content=description_3,
    hash=hashlib.sha256(description_3.encode()).hexdigest()
)

description_4_model = Description(
    content=description_4,
    hash=hashlib.sha256(description_4.encode()).hexdigest()
)

description_5_model = Description(
    content=description_5,
    hash=hashlib.sha256(description_5.encode()).hexdigest()
)

with open("app/mocks/img1.jpg", "rb") as file:
   image_content = file.read()
   image_hash = hashlib.sha256(image_content).hexdigest()
   photo1 = session.query(Photo).get(image_hash)
   if not photo1:
      photo1 = Photo(
         hash=image_hash,
         image=image_content
      )
      session.add(photo1)

with open("app/mocks/img2.jpeg", "rb") as file:
   image_content = file.read()
   image_hash = hashlib.sha256(image_content).hexdigest()
   photo2 = session.query(Photo).get(image_hash)
   if not photo2:
      photo2 = Photo(
         hash=image_hash,
         image=image_content
      )
      session.add(photo2)
with open("app/mocks/img3.jpeg", "rb") as file:
   image_content = file.read()
   image_hash = hashlib.sha256(image_content).hexdigest()
   photo3 = session.query(Photo).get(image_hash)
   if not photo3:
      photo3 = Photo(
         hash=image_hash,
         image=image_content
      )
      session.add(photo3)


campaign1_id = "cmp123_hex"
campaign2_id = "cmp2_hex"

campaign1 = StashCampaign(
    campaign_id=campaign1_id,
    description_hash=description_1_model.hash,
    campaign_creator="0xabadc4402C14844431fC7521613b6922c7bdde80",
    reward=500,
    reward_token="rewardToken123",
    token_symbol="ETH",
    blockchain="ethereum",
    campaign_type=1,
    max_submissions=1000,
    remained_submissions=800,
    top_left_lat=40.712776,
    top_left_long=-74.005974,
    bottom_right_lat=34.052235,
    bottom_right_long=-118.243683
)

campaign2 = StashCampaign(
    campaign_id=campaign2_id,
    description_hash=description_2_model.hash,
    campaign_creator="0xabadc4402C14844431fC7521613b6922c7bdde80",
    reward=1000,
    reward_token="rewardToken456",
    token_symbol="BTC",
    blockchain="bitcoin",
    campaign_type=2,
    max_submissions=500,
    remained_submissions=450,
    top_left_lat=51.507351,
    top_left_long=-0.127758,
    bottom_right_lat=48.856613,
    bottom_right_long=2.352222
)

submission1 = Submission(
    submission_id="0x70C3f7fd4c9bECA84c5e3Ff117e41c7219f7a84D",
    campaign_id=campaign1_id,
    photo_hash=photo1.hash,
    description_hash=description_3_model.hash,
    status=1,
    lat=37.7749,  # within the bounds of campaign1
    long=-122.4194  # within the bounds of campaign1
)

submission2 = Submission(
    submission_id="0x6FB89099EE30a4dcD80853BDa17104641c1D2542",
    campaign_id=campaign1_id,
    photo_hash=photo2.hash,
    description_hash=description_4_model.hash,
    status=1,
    lat=36.7783,  # within the bounds of campaign1
    long=-119.4179  # within the bounds of campaign1
)

submission3 = Submission(
    submission_id="sub789",
    campaign_id=campaign2_id,
    photo_hash=photo3.hash,
    description_hash=description_5_model.hash,
    status=1,
    lat=50.110924,  # within the bounds of campaign2
    long=8.682127  # within the bounds of campaign2
)

verification_1 = VerificationRequest(
    submission_id="0x70C3f7fd4c9bECA84c5e3Ff117e41c7219f7a84D",
    verifier_id="0x6FB89099EE30a4dcD80853BDa17104641c1D2542"
)

verification_2 = VerificationRequest(
    submission_id="0x6FB89099EE30a4dcD80853BDa17104641c1D2542",
    verifier_id="0x1C33A2dc73E500CD3358f4068d32297870BC2977"
)
verification_3 = VerificationRequest(
    submission_id="0x1C33A2dc73E500CD3358f4068d32297870BC2977",
    verifier_id="0x70C3f7fd4c9bECA84c5e3Ff117e41c7219f7a84D"
)
# Add StashCampaigns to session
session.add(description_1_model)
session.add(description_2_model)
session.add(description_3_model)
session.add(description_4_model)
session.add(campaign1)
session.add(campaign2)
session.add(submission1)
session.add(submission2)
session.add(submission3)
session.add(verification_1)
session.add(verification_2)
session.add(verification_3)
session.commit()

# Close session
session.close()