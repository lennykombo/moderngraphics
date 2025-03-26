/*export const products = [
    { id: 1, name: "Smartphone", category: "Electronics", price: "$699", image: "https://www.celletronic.com/wp-content/uploads/2024/01/Samsung-Galaxy-S24-ULTRA-BLACK.jpg" },
    { id: 2, name: "Laptop", category: "Electronics", price: "$999", image: "https://betanews.com/wp-content/uploads/2014/11/front-scaled.jpg" },
    { id: 3, name: "Sneakers", category: "Clothing", price: "$89", image: "https://th.bing.com/th/id/OIP.5aQI4WRsXkN9n0-2OdYo8gHaHa?w=600&h=600&rs=1&pid=ImgDetMain" },
    { id: 4, name: "Sofa", category: "Home", price: "$499", image: "https://th.bing.com/th/id/OIP.itkDcbPqdzHOjfRjJAhSHwHaEI?rs=1&pid=ImgDetMain" },
  ];
  */

  export const products = [
    {
      id: 1,
      name: "Smartphone",
      category: "Electronics",
      price: "$699",
      image: "https://www.celletronic.com/wp-content/uploads/2024/01/Samsung-Galaxy-S24-ULTRA-BLACK.jpg",
      gallery: [
        "https://www.celletronic.com/wp-content/uploads/2024/01/Samsung-Galaxy-S24-ULTRA-BLACK.jpg", // Main Image
        "https://cdn.mos.cms.futurecdn.net/ikKRaNBKNbXCRXXoEhNvZi.jpg", // Side View
        "https://cdn.i-scmp.com/sites/default/files/d8/images/canvas/2023/02/13/27ae808e-158d-4ac2-9c7c-fdd8bb5ceed9_1126e908.jpg", // Back View
        "https://youtu.be/EIb6jfzYXCo", // Video Demo (Replace with actual video URL)
      ],
    },
    {
      id: 2,
      name: "Laptop",
      category: "Electronics",
      price: "$999",
      image: "https://betanews.com/wp-content/uploads/2014/11/front-scaled.jpg",
      gallery: [
        "https://betanews.com/wp-content/uploads/2014/11/front-scaled.jpg", // Main Image
        "https://example.com/laptop-side.jpg", // Side View (Replace with real image)
        "https://example.com/laptop-keyboard.jpg", // Keyboard View
        "https://www.example.com/laptop-demo.mp4", // Video Demo
      ],
    },
    {
      id: 3,
      name: "Sneakers",
      category: "Clothing",
      price: "$89",
      image: "https://th.bing.com/th/id/OIP.5aQI4WRsXkN9n0-2OdYo8gHaHa?w=600&h=600&rs=1&pid=ImgDetMain",
      gallery: [
        "https://th.bing.com/th/id/OIP.5aQI4WRsXkN9n0-2OdYo8gHaHa?w=600&h=600&rs=1&pid=ImgDetMain",
        "https://example.com/sneakers-side.jpg",
        "https://example.com/sneakers-sole.jpg",
        "https://www.example.com/sneakers-video.mp4",
      ],
    },
    {
      id: 4,
      name: "Sofa",
      category: "Home",
      price: "$499",
      image: "https://th.bing.com/th/id/OIP.itkDcbPqdzHOjfRjJAhSHwHaEI?rs=1&pid=ImgDetMain",
      gallery: [
        "https://th.bing.com/th/id/OIP.itkDcbPqdzHOjfRjJAhSHwHaEI?rs=1&pid=ImgDetMain",
        "https://example.com/sofa-side.jpg",
        "https://example.com/sofa-top.jpg",
        "https://www.example.com/sofa-demo.mp4",
      ],
    },
  ];
  