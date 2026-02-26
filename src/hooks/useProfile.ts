import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { IProfile, User } from "../models/api";

export const useProfile = (session: Session) => {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [users, setUsers] = useState<User[]>([]);

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

  useEffect(() => {
    const getUsers = async () => {
      const { data, error } = await supabase.from("profiles").select("*");

      if (error) console.error(error);
      if (data) setUsers(data);
    };

    getUsers();
  }, []);

  return { profile, users };
};
