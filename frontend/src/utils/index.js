import { useState } from "react";
import ls from "local-storage";
import { toast } from "react-toastify";
import { Base64 } from "js-base64";

export function isEmpty(val) {
  return val === undefined || val == null || val.length <= 0 ? true : false;
}

export function isEmailValid(email) {
  if (!email) return false;

  if (email.length > 254) return false;

  var emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  var valid = emailRegex.test(email);
  if (!valid) return false;

  // Further checking of some things regex can't handle
  var parts = email.split("@");
  if (parts[0].length > 64) return false;

  var domainParts = parts[1].split(".");
  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  )
    return false;

  return true;
}

/*
 Check phone number 10 or 9 digit
*/
export function isPhoneValid(phone_number) {
  return (
    /^(?:\W*\d){10}\W*$/.test(phone_number) ||
    /^(?:\W*\d){9}\W*$/.test(phone_number)
  );
}

export const uniqueId = (uid) => {
  // if(isEmpty(uid)){
  //     var uniqueId = ls.get('uniqueId')
  //     if(isEmpty(uniqueId)){
  //         const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  //         uniqueId = Base64.encode(uint32.toString( 35 ));
  //         ls.set('uniqueId', uniqueId)
  //     }else{
  //         var arr_uniqueId = (Base64.decode(uniqueId)).split("&");
  //         if(arr_uniqueId.length > 1){
  //             const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  //             uniqueId = Base64.encode(uint32.toString( 35 ));
  //             ls.set('uniqueId', uniqueId)
  //         }
  //     }
  //     return uniqueId;
  // }else {
  //     var uniqueId = ls.get('uniqueId')
  //     if(isEmpty(uniqueId)){
  //         const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  //         uniqueId = Base64.encode(uint32.toString( 35 ) +'&'+ Base64.encode(uid))
  //         ls.set('uniqueId', uniqueId)
  //     }else{
  //         var arr_uniqueId = (Base64.decode(uniqueId)).split("&");
  //         if(arr_uniqueId.length == 2){
  //             if(Base64.decode(arr_uniqueId[1]) !== uid){
  //                 const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  //                 uniqueId = Base64.encode(uint32.toString( 35 ) +'&'+ Base64.encode(uid))
  //                 ls.set('uniqueId', uniqueId)
  //             }
  //         }else{
  //             const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  //             uniqueId = Base64.encode(uint32.toString( 35 ) +'&'+ Base64.encode(uid))
  //             ls.set('uniqueId', uniqueId)
  //         }
  //     }
  //     return uniqueId;
  // }
};

export const mergeArrays = (...arrays) => {
  let jointArray = [];

  arrays.forEach((array) => {
    jointArray = [...jointArray, ...array];
  });
  const uniqueArray = jointArray.reduce((newArray, item) => {
    let found = newArray.find(({ id }) => id === item.id);
    if (found) {
      return newArray;
    } else {
      return [...newArray, item];
    }
  }, []);
  return uniqueArray;
};

export const isFile = (input) => {
  if ("File" in window && input instanceof File) return true;
  else return false;
};

export const onToast = (type, message) => {
  switch (type) {
    case "info": {
      toast.info(message, {
        position: "bottom-right",
        hideProgressBar: true,
        autoClose: 3000,
      });
      break;
    }
    case "error": {
      toast.error(message, {
        position: "bottom-right",
        hideProgressBar: true,
        autoClose: 3000,
      });
      break;
    }
  }
};

export const commaFormatted = (amount) => {
  return Number(parseFloat(amount).toFixed(2)).toLocaleString("en", {
    minimumFractionDigits: 2,
  });
};

export const ReadMore = ({ children }) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <p className="text">
      {isReadMore ? text.slice(0, 150) : text}
      <span onClick={toggleReadMore} className="read-or-hide">
        {text.length >= 150 ? (isReadMore ? "...Read more" : " Show less") : ""}
      </span>
    </p>
  );
};

export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const random = (length) => {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
  );
};
