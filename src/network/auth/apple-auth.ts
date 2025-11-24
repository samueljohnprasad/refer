import { randomUUID } from "expo-crypto";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "./supabase";
import { Session, User } from "@supabase/supabase-js";
const nonce = randomUUID();

export async function signInWithApple() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    console.log("signInWithApple credential ", credential);
    return credential;
  } catch (err) {
    console.error("signInWithApple err");
    alert("Apple login failed");
    
    throw err;
  }
}

export async function loginAppleToSupabase(
  credential: AppleAuthentication.AppleAuthenticationCredential
) {
  const { identityToken } = credential;
  console.log("signInWithApple identityToken ", identityToken);
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "apple",
    token: identityToken!,
  });

  console.log("signInWithApple data ", data);
  console.log("error ", error);
  if (error) throw error;

  return data;
}

export async function handleApple(): Promise<{
  user: User;
  session: Session;
}> {
  try {
    console.log("signInWithApple handleApple");
    const credential = await signInWithApple();
    console.log("credential ", credential);
    const data = await loginAppleToSupabase(credential);
    alert("Signed in!");
    console.log("handleApple ", data);
    return data;
  } catch (err) {
    console.error(err);
    alert("Apple login failed");
    throw err;
  }
}
