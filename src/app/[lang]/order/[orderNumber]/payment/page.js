import CheckoutOrderComplete from 'src/sections/checkout/checkout-order-complete';
// api
import { getOrderStatus } from 'src/api/payment';
import { getOrderPaymentAccess, editPaymentStatus } from 'src/api/order';

async function checkAccess(orderNumber, token) {
  const { data, error  } = await getOrderPaymentAccess(orderNumber, token);
  return { access: data, accessError: error };
}

async function getData(orderNumber, lang) {
  try {
    const { data: orderStatus, error: orderStatusError } = await getOrderStatus(orderNumber, lang);
    
    if (orderStatusError) throw orderStatusError;

    if (orderStatus.orderStatus === 2) {
      await editPaymentStatus(orderNumber, { paymentStatus: 'paid' });
    } else {
      if(orderStatus.errorCode !== "0") {
        throw orderStatus.errorMessage;
      }

      await editPaymentStatus(orderNumber, { paymentStatus: 'failed' });

      throw orderStatus.actionCodeDescription;
    }

    return { orderStatus };
  } catch (error) {
    return { error };
  }
}

export default async function PostsPage({ params, searchParams }) {
  const { lang, orderNumber } = params;

  const { token } = searchParams;

  const { accessError } = await checkAccess(orderNumber, token);

  if (accessError) {
    return <CheckoutOrderComplete error={accessError} open={true} />;
  }

  const { orderStatus, error } = await getData(orderNumber, lang);

  return <CheckoutOrderComplete status={orderStatus} error={error} open={true} />;
}