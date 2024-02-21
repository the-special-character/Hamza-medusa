import { GetServerSideProps } from "next"
import { Metadata } from "next"

// Define a function to fetch or generate metadata during SSR
export const getServerSideProps: GetServerSideProps = async () => {
  const metadata: Metadata = {
    // Generate metadata here based on your requirements
  }

  // Return the metadata as a prop
  return {
    props: {
      metadata,
    },
  }
}
