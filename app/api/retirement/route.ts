import { connectToDB } from "../../../lib/connect"; // Import the DB connection function
 // Import the Investment model
import { NextRequest, NextResponse } from "next/server";
import Invest from "../model/retirement.model";
import axios from "axios";
const PAYSTACK_SECRET_KEY = "sk_live_58fe2547f764f61e63084f063f7f1af22701774d";
// POST: Submit investment data
export const POST = async (req: NextRequest) => {
  await connectToDB();
  try {
    // Parse incoming JSON data from the request body
    const requestData = await req.json();
    const {
      name,
      gender,
        dob,
      email,
      goals,
      dependents,
      occupation,
      workStatus,
      salary,
      investmentRange,
      contactNumber,
        instagramName,
      bankingInstitutions,  session,
      linkedinName,
    } = requestData;

    // Validate required fields (example validation for critical fields)
    if (!name || !gender || !dob || !goals || !salary || !contactNumber) {
      return NextResponse.json(
        { message: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // Create a new investment document
    const newInvestment = new Invest({
      name,
      gender,
      dob,
        goals,
      email,
      dependents,
      occupation,
      workStatus,
      salary,
      investmentRange,
      contactNumber,
      instagramName,
      linkedinName,
      session,
      bankingInstitutions
    });
      
      const amount = 550 *100

    // Save the new investment data to the database
      const savedInvestment = await newInvestment.save();
      
          const metadata = {
      name,
      email,contactNumber
    };

    // Initialize payment with Paystack
    const paymentResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount,
        metadata,
        currency: "GHS", // Set the currency to Ghanaian Cedi
        channels: ["card", "mobile_money"],
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the payment initialization was successful
    if (paymentResponse.data.status) {
      // Return the payment URL to the frontend
      return NextResponse.json({
          message: "Payment initialisation successful",
          savedInvestment,
        paystackUrl: paymentResponse.data.data.authorization_url,
      });
    } else {
      throw new Error("Payment initialization failed");
    }

    // Return a success response with the saved data
   
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    // Handle errors
    console.error("Error saving investment data:", error);
    return NextResponse.json(
      { message: "An error occurred while submitting the form", error: error.message },
      { status: 500 }
    );
  }
};
