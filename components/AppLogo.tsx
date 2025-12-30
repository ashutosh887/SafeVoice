import { Image } from "react-native";

type LogoProps = {
  size?: number;
};

export default function Logo({ size = 120 }: LogoProps) {
  return (
    <Image
      source={require("@/assets/images/logo.jpeg")}
      resizeMode="contain"
      style={{ width: size, height: size }}
    />
  );
}
