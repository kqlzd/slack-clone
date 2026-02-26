import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { IProfile } from "../models/api";

export const useProfile = (session: Session) => {
  const [profile, setProfile] = useState<IProfile | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) console.error(error);
      if (data) setProfile(data);
    };

    getProfile();
  }, [session]);

  return { profile };
};
