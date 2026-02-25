import { Avatar } from "@chakra-ui/react";

type TProps = {
  email: string | undefined;
};

export const AvatarComponent = ({ email }: TProps) => {
  return (
    <Avatar.Root>
      <Avatar.Fallback name={email} />
    </Avatar.Root>
  );
};
