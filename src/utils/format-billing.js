export function formatBilling(address) {
    const format = {
        fullName: address?.fullName || address?.full_name,
        phone: address?.phone,
        country: typeof address?.country === 'object' ? address.country?.label : address?.country,
        countryCode: typeof address?.country === 'object' ? address.country?.value : address?.country_code,
        city: typeof address?.city === 'object' ? address.city?.label : address?.city,
        econtCityId: typeof address?.city === 'object' ? address.city?.value : address?.econt_city_id,
        quarter: address?.quarter,
        postCode: address?.postCode || address?.post_code,
        street: address?.street,
        streetNumber: address?.streetNumber || address?.street_number,
        buildingNumber: address?.buildingNumber || address?.building_number,
        entrance: address?.entrance,
        floor: address?.floor,
        apartment: address?.apartment,
        note: address?.note
    }

    return format;
}