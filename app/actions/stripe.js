"use server"
import { stripe } from "@/lib/stripe"
import { formateAmountForStripe } from "@/lib/stripe-helpers"
import { getCourseDetails } from "@/queries/courses"
import { headers } from "next/headers"
import Stripe from "stripe"
const CURRENCY = "USD"

export async function createCheckoutSession(data){
    const ui_mode = 'hosted';
    const origin = headers().get('origin')
    const courseId = data.get('courseId')
    // const title = data.get('title')
    // const price = data.get('price')
    const courseInfo = await getCourseDetails(courseId)
    if(!courseInfo) return new Error('Course not found!')
    const courseName = courseInfo?.title;
    const coursePrice = courseInfo?.price;

    const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        submit_type: "auto",
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: CURRENCY,
                    product_data: {
                        name: courseName
                    },
                    unit_amount: formateAmountForStripe(coursePrice, CURRENCY)
                }
            }
        ],
        ...(ui_mode === 'hosted' && {
            success_url: `${origin}/enroll-success?session_id={CHECKOUT_SESSION_ID}&courseId=${courseId}`,
            cancel_url: `${origin}/courses`
        }),
        ui_mode,
    })
    return{
        client_secret: checkoutSession.client_secret,
        url: checkoutSession.url
    }

}

export async function createPaymentIntent(data){
    const paymentIntent = await Stripe.paymentIntent.create({
        amount: formateAmountForStripe(coursePrice, CURRENCY),
        automatic_payment_methods: {enabled: true},
        currency: CURRENCY
    })
    return {client_secret: paymentIntent.client_secret}
}