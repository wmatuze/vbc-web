import { useQuery } from "@tanstack/react-query";
import config from "../config";

export const CHURCH_CONFIG_QUERY_KEY = ["church-config"];

export const DEFAULT_CHURCH_CONFIG = {
  name: "Victory Bible Church",
  address: "Off Chiwala Road, CBU East Gate",
  email: "info@victorybiblechurch.com",
  phone: "+260 964 985 651",
  website: "",
  siteTitle: "Victory Bible Church",
  metaDescription: "",
  officeHours: {
    days: "Tuesday – Friday",
    time: "09:30 – 16:00 hrs",
  },
  socialLinks: {
    facebook: "https://facebook.com/VictoryBibleChurchKitwe",
    instagram: "https://instagram.com/victorybiblechurchkitwe",
    youtube: "https://youtube.com/@BishopSimwanza",
    whatsapp: "https://wa.me/260763232222",
  },
};

const valueOrDefault = (value, fallback) =>
  typeof value === "string" && value.trim() ? value : fallback;

export const normalizeChurchConfig = (value = {}) => ({
  ...value,
  name: valueOrDefault(value.name, DEFAULT_CHURCH_CONFIG.name),
  address: valueOrDefault(value.address, DEFAULT_CHURCH_CONFIG.address),
  email: valueOrDefault(value.email, DEFAULT_CHURCH_CONFIG.email),
  phone: valueOrDefault(value.phone, DEFAULT_CHURCH_CONFIG.phone),
  website: value.website || DEFAULT_CHURCH_CONFIG.website,
  siteTitle: valueOrDefault(value.siteTitle, DEFAULT_CHURCH_CONFIG.siteTitle),
  metaDescription: value.metaDescription || DEFAULT_CHURCH_CONFIG.metaDescription,
  officeHours: {
    days: valueOrDefault(value.officeHours?.days, DEFAULT_CHURCH_CONFIG.officeHours.days),
    time: valueOrDefault(value.officeHours?.time, DEFAULT_CHURCH_CONFIG.officeHours.time),
  },
  socialLinks: {
    facebook: valueOrDefault(value.socialLinks?.facebook, DEFAULT_CHURCH_CONFIG.socialLinks.facebook),
    instagram: valueOrDefault(value.socialLinks?.instagram, DEFAULT_CHURCH_CONFIG.socialLinks.instagram),
    youtube: valueOrDefault(value.socialLinks?.youtube, DEFAULT_CHURCH_CONFIG.socialLinks.youtube),
    whatsapp: valueOrDefault(value.socialLinks?.whatsapp, DEFAULT_CHURCH_CONFIG.socialLinks.whatsapp),
  },
});

const fetchChurchConfig = async () => {
  const response = await fetch(`${config.API_URL}/api/config`);
  if (!response.ok) throw new Error("Could not load church information");
  return normalizeChurchConfig(await response.json());
};

export const useChurchConfig = () =>
  useQuery({
    queryKey: CHURCH_CONFIG_QUERY_KEY,
    queryFn: fetchChurchConfig,
    placeholderData: DEFAULT_CHURCH_CONFIG,
    staleTime: 60 * 1000,
    refetchOnMount: true,
  });
