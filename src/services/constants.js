export default {
  userStaticData: {
    location: "New York City",
    dob: "2023-04-06",
    email: process.env.VUE_APP_EMAIL,
    firstName: "Dummy",
    lastName: "test",
    availability: [
      {
        date: "2023-04-06",
        isAvailable: false,
        range:{lower: 18, upper: 21}
      },
    ],
    interests: {
      Adventures: ["Rock-Climbing", "Trekking", "Camping"],
      Sports: ["Cricket", "Aquatics"],
    },
  },
};
