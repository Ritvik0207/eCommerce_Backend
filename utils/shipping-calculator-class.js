const axios = require('axios');

class ShippingCalculator {
  /**
   * Initialize the shipping calculator with API keys and configuration
   * @param {Object} config Configuration object
   * @param {string} config.googleMapsApiKey Google Maps API key
   * @param {string} config.holidayApiKey Holiday API key
   * @param {number} [config.ratePerKm=0.5] Shipping rate per kilometer
   * @param {number} [config.baseRate=10] Base shipping rate
   * @param {number} [config.standardDeliveryDays=3] Standard delivery time in days
   */
  constructor(config) {
    if (!config.googleMapsApiKey || !config.holidayApiKey) {
      throw new Error('Missing required API keys');
    }

    this.googleMapsApiKey = config.googleMapsApiKey;
    this.holidayApiKey = config.holidayApiKey;
    this.ratePerKm = config.ratePerKm || 0.5;
    this.baseRate = config.baseRate || 10;
    this.standardDeliveryDays = config.standardDeliveryDays || 3;
  }

  /**
   * Calculate distance between two locations using Google Maps API
   * @param {string} origin Origin address
   * @param {string} destination Destination address
   * @returns {Promise<number>} Distance in kilometers
   */
  async calculateDistance(origin, destination) {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/distancematrix/json',
        {
          params: {
            origins: origin,
            destinations: destination,
            key: this.googleMapsApiKey,
          },
        }
      );

      if (response.data.status === 'OK') {
        const distance = response.data.rows[0].elements[0].distance.value;
        return distance / 1000; // Convert to kilometers
      }
      throw new Error('Unable to calculate distance');
    } catch (error) {
      throw new Error(`Distance calculation failed: ${error.message}`);
    }
  }

  /**
   * Get holidays between two dates
   * @param {string} startDate Start date (YYYY-MM-DD)
   * @param {string} endDate End date (YYYY-MM-DD)
   * @param {string} [country='IN'] Country code
   * @returns {Promise<Array>} List of holidays
   */
  async getHolidays(startDate, endDate, country = 'IN') {
    try {
      const response = await axios.get('https://holidayapi.com/v1/holidays', {
        params: {
          key: this.holidayApiKey,
          country,
          start: startDate,
          end: endDate,
        },
      });

      return response.data.holidays || [];
    } catch (error) {
      throw new Error(`Holiday API request failed: ${error.message}`);
    }
  }

  /**
   * Calculate business days excluding holidays and weekends
   * @param {Date} startDate Start date
   * @param {Date} endDate End date
   * @param {Array} holidays List of holidays
   * @returns {number} Number of business days
   */
  calculateBusinessDays(startDate, endDate, holidays) {
    let businessDays = 0;
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        const isHoliday = holidays.some(
          (holiday) => holiday.date === current.toISOString().split('T')[0]
        );
        if (!isHoliday) {
          businessDays++;
        }
      }
      current.setDate(current.getDate() + 1);
    }
    return businessDays;
  }

  /**
   * Calculate shipping cost based on distance
   * @param {number} distanceKm Distance in kilometers
   * @returns {number} Shipping cost
   */
  calculateShippingCost(distanceKm) {
    return Math.ceil(this.baseRate + distanceKm * this.ratePerKm);
  }

  /**
   * Calculate final delivery date
   * @param {Date} startDate Shipment start date
   * @param {number} businessDays Number of business days
   * @returns {Date} Final delivery date
   */
  calculateDeliveryDate(startDate, businessDays, holidays) {
    const deliveryDate = new Date(startDate);
    let daysToAdd = 0;
    let businessDaysAdded = 0;

    while (businessDaysAdded < businessDays) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
        businessDaysAdded++;
      }
      daysToAdd++;
    }

    // Check if the calculated delivery date is a holiday and add 1 every time
    while (
      holidays.some(
        (holiday) => holiday.date === deliveryDate.toISOString().split('T')[0]
      )
    ) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }

    return deliveryDate;
  }

  /**
   * Calculate complete shipping details
   * @param {Object} params Shipping parameters
   * @param {string} params.origin Origin address
   * @param {string} params.destination Destination address
   * @param {string} params.shipmentDate Shipment date (YYYY-MM-DD)
   * @param {string} [params.country='US'] Country code for holidays
   * @returns {Promise<Object>} Shipping details including cost and delivery date
   */
  async calculateShipping({
    origin,
    destination,
    shipmentDate,
    country = 'IN',
  }) {
    try {
      //   just for now return static
      return {
        distanceInKm: 0,
        shippingCost: Number(
          process.env.SHIPPING_COST_BEFORE_ADDING_GOOGLE_API
        ),
        // 10 days from now
        estimatedDeliveryDate: new Date(
          new Date().setDate(new Date().getDate() + 10)
        ).toISOString(),
        businessDays: 10,
        holidays: [],
      };

      // Validate input
      //   if (!origin || !destination || !shipmentDate) {
      //     throw new Error('Missing required parameters');
      //   }

      //   // Calculate distance
      //   const distanceKm = await this.calculateDistance(origin, destination);

      //   // Calculate shipping cost
      //   const shippingCost = this.calculateShippingCost(distanceKm);

      //   // Calculate estimated delivery timeframe
      //   const startDate = new Date(shipmentDate);
      //   const estimatedEndDate = new Date(startDate);
      //   estimatedEndDate.setDate(
      //     startDate.getDate() + this.standardDeliveryDays + 2
      //   );

      //   // Get holidays
      //   const holidays = await this.getHolidays(
      //     startDate.toISOString().split('T')[0],
      //     estimatedEndDate.toISOString().split('T')[0],
      //     country
      //   );

      //   // Calculate business days
      //   const businessDays = this.calculateBusinessDays(
      //     startDate,
      //     estimatedEndDate,
      //     holidays
      //   );

      //   // Calculate final delivery date
      //   const finalDeliveryDate = this.calculateDeliveryDate(
      //     startDate,
      //     businessDays,
      //     holidays
      //   );

      //   return {
      //     distanceInKm: Math.round(distanceKm * 100) / 100,
      //     shippingCost,
      //     estimatedDeliveryDate: finalDeliveryDate.toISOString().split('T')[0],
      //     businessDays,
      //     holidays,
      //   };
    } catch (error) {
      throw new Error(`Shipping calculation failed: ${error.message}`);
    }
  }
}

const shippingCalculator = new ShippingCalculator({
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  holidayApiKey: process.env.HOLIDAY_API_KEY,
  baseRate: 100,
  ratePerKm: 10,
  standardDeliveryDays: 5,
});

module.exports = shippingCalculator;
