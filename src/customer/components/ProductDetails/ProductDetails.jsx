import { StarIcon } from "@heroicons/react/20/solid";
import { Rating, Button, Grid, Box, LinearProgress } from "@mui/material";
import ProductReviewCard from "./ProductReviewCard";
import HomeSectionCard from "../HomeSectionCard/HomeSectionCard";
import { mens_kurta } from "../../../Data/mens-kurta";


const product = {
  name: "Basic Tee 6-Pack",
  price: "$192",
  href: "#",
  breadcrumbs: [
    { id: 1, name: "Men", href: "#" },
    { id: 2, name: "Clothing", href: "#" },
  ],
  images: [
    {
      src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-secondary-product-shot.jpg",
      alt: "Two each of gray, white, and black shirts laying flat.",
    },
    {
      src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg",
      alt: "Model wearing plain black basic tee.",
    },
    {
      src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg",
      alt: "Model wearing plain gray basic tee.",
    },
    {
      src: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-featured-product-shot.jpg",
      alt: "Model wearing plain white basic tee.",
    },
  ],
  colors: [
    {
      id: "white",
      name: "White",
      classes: "bg-white checked:outline-gray-400",
    },
    {
      id: "gray",
      name: "Gray",
      classes: "bg-gray-200 checked:outline-gray-400",
    },
    {
      id: "black",
      name: "Black",
      classes: "bg-gray-900 checked:outline-gray-900",
    },
  ],
  sizes: [
    { name: "S", inStock: true },
    { name: "M", inStock: true },
    { name: "L", inStock: true },
    { name: "XL", inStock: true },
  ],
  description:
    'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
  highlights: [
    "Hand cut and sewn locally",
    "Dyed with our proprietary colors",
    "Pre-washed & pre-shrunk",
    "Ultra-soft 100% cotton",
  ],
  details:
    'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
};
const reviews = { href: "#", average: 4, totalCount: 117 };

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetails() {
  return (
    <div className="bg-white">
      <div className="pt-6 px-5">
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            {product.breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a
                    href={breadcrumb.href}
                    className="mr-2 text-sm font-medium text-gray-900"
                  >
                    {breadcrumb.name}
                  </a>
                  <svg
                    fill="currentColor"
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              <a
                href={product.href}
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {product.name}
              </a>
            </li>
          </ol>
        </nav>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10 px-4 pt-10">
          {/* Image gallery */}
          <div className="flex flex-col items-center ">
            <div className="overflow-hidden rounded-lg w-full max-w-[30rem] max-h-[35rem]">
              <img
                alt={product.images[0].alt}
                src={product.images[0].src}
                className="h-full w-full object-cover object-center"
              />
            </div>

            <div className="flex flex-wrap space-x-5 justify-center ">
              {product.images.map((image) => (
                <div className="aspect-3/2 overflow-hidden rounded-lg max-w-[5rem] max-h-[5rem] mt-5">
                  <img
                    alt={image.alt}
                    src={image.src}
                    className="size-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="lg:col-span-1 mx-auto max-w-2xl px-4 pb-16 sm:px-6 lg:max-w-7xl lg:px-8 lg:pb-24">
            <div className="lg:col-span-2 ">
              <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
                {product.name}
              </h1>
              <h1 className="text-lg lg:text-xl font-semibold text-gray-900 opacity-60 pt-1">
                Casual Puff Sleeves Solid Women White Top
              </h1>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <div className="flex space-x-5 items-center text-lg lg:text-xl text-gray-900">
                <p className="font-semibold">$199</p>
                <p className="opacity-60 line-through">$220</p>
                <p className="text-green-500 font-semibold">5% Off</p>
              </div>

              {/* Reviews */}
              <div className="mt-6">
                <div className="flex items-center space-x-3">
                  <Rating name="read-only" defaultValue={5.5} readOnly />
                  <p className="opacity-60 text-sm "> 56540 Ratings </p>
                  <p className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    3870 Reviews
                  </p>
                </div>
              </div>

              <form className="mt-10">
                {/* Colors */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Color</h3>

                  <fieldset aria-label="Choose a color" className="mt-4">
                    <div className="flex items-center gap-x-3">
                      {product.colors.map((color) => (
                        <div
                          key={color.id}
                          className="flex rounded-full outline -outline-offset-1 outline-black/10"
                        >
                          <input
                            defaultValue={color.id}
                            defaultChecked={color === product.colors[0]}
                            name="color"
                            type="radio"
                            aria-label={color.name}
                            className={classNames(
                              color.classes,
                              "size-8 appearance-none rounded-full forced-color-adjust-none checked:outline-2 checked:outline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-3",
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>

                {/* Sizes */}
                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <a
                      href="#"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Size guide
                    </a>
                  </div>

                  <fieldset aria-label="Choose a size" className="mt-4">
                    <div className="grid grid-cols-4 gap-3">
                      {product.sizes.map((size) => (
                        <label
                          key={size.id}
                          aria-label={size.name}
                          className="group relative flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 has-checked:border-indigo-600 has-checked:bg-indigo-600 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-indigo-600 has-disabled:border-gray-400 has-disabled:bg-gray-200 has-disabled:opacity-25"
                        >
                          <input
                            defaultValue={size.id}
                            defaultChecked={size === product.sizes[2]}
                            name="size"
                            type="radio"
                            disabled={!size.inStock}
                            className="absolute inset-0 appearance-none focus:outline-none disabled:cursor-not-allowed"
                          />
                          <span className="text-sm font-medium text-gray-900 uppercase group-has-checked:text-white">
                            {size.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
                <div className="flex justify-center">
                  <Button
                    className=""
                    variant="contained"
                    sx={{
                      bgcolor: "#9154fd",
                      "&:hover": { bgcolor: "#643cb2" },
                      color: "#fff",
                      mt: "20px",
                    }}
                  >
                    Add To Cart
                  </Button>
                </div>
              </form>
            </div>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
              {/* Description and details */}
              <div>
                <h3 className="sr-only">Description</h3>

                <div className="space-y-6">
                  <p className="text-base text-gray-900">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">
                  Highlights
                </h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                    {product.highlights.map((highlight) => (
                      <li key={highlight} className="text-gray-400">
                        <span className="text-gray-600">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">Details</h2>

                <div className="mt-4 space-y-6">
                  <p className="text-sm text-gray-600">{product.details}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rating & Review*/}
        <section className="px-4">
          <h1 className="font-semibold text-lg pb-4">
            Recent Review And Rating
          </h1>
          <div className="border border-mauve-200 p-5">
            <Grid container spacing={7}>
              <Grid size={{ xs: 12, md: 7 }}>
                {[1, 1, 1, 1].map((item) => (
                  <ProductReviewCard />
                ))}
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <h1 className="font-semibold text-xl pb-2">Products Rating</h1>
                <div className="flex items-center space-x-3">
                  <Rating value={4.5} precision={0.5} readOnly />
                  <p className="opacity-70 text-sm">54890 Ratings</p>
                </div>

                <Box className="mt-5 space-y-3">
                  <Grid
                    container
                    spacing={2}
                    sx={{ justifyContent: "left", alignItems: "center" }}
                  >
                    <Grid size={{ xs: 2 }}>
                      <p>Excellent</p>
                    </Grid>
                    <Grid size={{ xs: 7 }}>
                      <LinearProgress
                        variant="determinate"
                        value={40}
                        color="success"
                        sx={{
                          backgroundColor: "#d0d0d0",
                          borderRadius: 4,
                          height: 7,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                    sx={{ justifyContent: "left", alignItems: "center" }}
                  >
                    <Grid size={{ xs: 2 }}>
                      <p>Very Good</p>
                    </Grid>
                    <Grid size={{ xs: 7 }}>
                      <LinearProgress
                        variant="determinate"
                        value={30}
                        color="primary"
                        sx={{
                          backgroundColor: "#d0d0d0",
                          borderRadius: 4,
                          height: 7,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                    sx={{ justifyContent: "left", alignItems: "center" }}
                  >
                    <Grid size={{ xs: 2 }}>
                      <p>Good</p>
                    </Grid>
                    <Grid size={{ xs: 7 }}>
                      <LinearProgress
                        variant="determinate"
                        value={25}
                        color="info"
                        sx={{
                          backgroundColor: "#d0d0d0",
                          borderRadius: 4,
                          height: 7,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                    sx={{ justifyContent: "left", alignItems: "center" }}
                  >
                    <Grid size={{ xs: 2 }}>
                      <p>Average</p>
                    </Grid>
                    <Grid size={{ xs: 7 }}>
                      <LinearProgress
                        variant="determinate"
                        value={20}
                        color="warning"
                        sx={{
                          backgroundColor: "#d0d0d0",
                          borderRadius: 4,
                          height: 7,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                    sx={{ justifyContent: "left", alignItems: "center" }}
                  >
                    <Grid size={{ xs: 2 }}>
                      <p>Poor</p>
                    </Grid>
                    <Grid size={{ xs: 7 }}>
                      <LinearProgress
                        variant="determinate"
                        value={15}
                        color="error"
                        sx={{
                          backgroundColor: "#d0d0d0",
                          borderRadius: 4,
                          height: 7,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </div>
        </section>

        {/* Similar Products */}
        <section className="pt-10 px-4">
          <h1 className="font-semibold text-lg py-5">Similar Products</h1>
          <div className=" grid grid-cols-5 gap-2 ">
            {mens_kurta.map((item) => <div className="flex justify-center mt-2.5" ><HomeSectionCard product={item}/></div>)}
          </div>
        </section>
      </div>
    </div>
  );
}
