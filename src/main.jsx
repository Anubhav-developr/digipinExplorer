import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MapPin, ArrowRightLeft, Copy, Check, LocateFixed, ArrowUpRight, ShieldCheck, Compass, ScanLine, Navigation, Github, Menu, X, Sparkles, ChevronDown, ExternalLink, Languages, MessageCircle } from 'lucide-react';
import './style.css';
import DigipinTechnology from "./DigipinTechnology";
import MapExplorer from './MapExplorer';  

const translations = {
  hi: {
    'A new address for': 'एक नया पता', 'Digital India.': 'डिजिटल इंडिया के लिए।',
    'DEPARTMENT OF POSTS · GOVERNMENT OF INDIA': 'डाक विभाग · भारत सरकार',
    'CONNECTING EVERY CORNER OF INDIA': 'भारत के हर कोने को जोड़ते हुए', 'Dak Sewa · Jan Sewa': 'डाक सेवा · जन सेवा',
    'A digital addressing initiative inspired by India’s geospatial future': 'भारत के भू-स्थानिक भविष्य से प्रेरित डिजिटल पता पहल',
    'A location, made precise.': 'हर स्थान का सटीक पता।', 'Explore': 'खोजें', 'How it works': 'यह कैसे काम करता है', 'About DIGIPIN': 'DIGIPIN के बारे में', 'Official source': 'आधिकारिक स्रोत',
    'THE NEW LANGUAGE OF LOCATION': 'स्थान की नई भाषा', 'Every place has a story.': 'हर जगह की अपनी कहानी है।', 'Give it an address.': 'उसे एक पता दें।',
    'Turn coordinates into a precise digital address. Explore India’s geospatial grid with DIGIPIN — built to make every location easier to identify and share.': 'निर्देशांकों को सटीक डिजिटल पते में बदलें। DIGIPIN से भारत के भू-स्थानिक ग्रिड को जानें—हर स्थान की पहचान और साझा करना अब आसान।',
    'Find your DIGIPIN': 'अपना DIGIPIN खोजें', 'Discover how it works': 'जानें यह कैसे काम करता है', 'Open-source technology': 'ओपन-सोर्स तकनीक', '10-character location code': '10 अक्षरों का लोकेशन कोड',
    'LOCATION FOUND': 'स्थान मिल गया', 'YOUR DIGITAL ADDRESS': 'आपका डिजिटल पता', 'PREVIEW': 'पूर्वावलोकन', 'INDIA · GRID 01': 'भारत · ग्रिड 01', 'PRECISION IN EVERY POINT': 'हर बिंदु पर सटीकता',
    'YOUR LOCATION, DECODED': 'आपका स्थान, समझा गया', 'Explore DIGIPIN': 'DIGIPIN एक्सप्लोर करें', 'Generate a code from coordinates, or decode a code to find its location.': 'निर्देशांकों से कोड बनाएं या कोड से स्थान पता करें।', 'Simple. Precise. Shareable.': 'सरल। सटीक। साझा करने योग्य।',
    'Generate DIGIPIN': 'DIGIPIN बनाएं', 'Decode a code': 'कोड डिकोड करें', 'Enter coordinates': 'निर्देशांक दर्ज करें', 'Use a latitude and longitude pair.': 'अक्षांश और देशांतर दर्ज करें।', 'Use my location': 'मेरी लोकेशन लें', 'Finding you…': 'आपकी लोकेशन खोज रहे हैं…', 'Your location is ready': 'आपकी लोकेशन तैयार है',
    'Latitude': 'अक्षांश', 'Longitude': 'देशांतर', 'India grid coverage: approximately 2.5°–38.5° N and 63.5°–99.5° E.': 'भारत ग्रिड कवरेज: लगभग 2.5°–38.5° उत्तर और 63.5°–99.5° पूर्व।',
    'Enter a DIGIPIN code': 'DIGIPIN कोड दर्ज करें', 'Use the continuous 10-character code.': 'बिना स्पेस वाला 10 अक्षरों का कोड इस्तेमाल करें।', '10 characters': '10 अक्षर', 'Accepted characters: 2–9, C, J, K, L, M, P, F and T.': 'मान्य अक्षर: 2–9, C, J, K, L, M, P, F और T।',
    'Working…': 'काम हो रहा है…', 'Generate my DIGIPIN': 'मेरा DIGIPIN बनाएं', 'Find this location': 'यह स्थान खोजें', 'YOUR RESULT WILL APPEAR HERE': 'आपका परिणाम यहां दिखेगा', 'Ready when you are.': 'आप तैयार हों, तो शुरू करें।', 'Enter your details and we’ll translate your location into a digital address.': 'जानकारी दर्ज करें और अपने स्थान को डिजिटल पते में बदलें।', 'Processed using the official open-source algorithm': 'आधिकारिक ओपन-सोर्स एल्गोरिदम से संसाधित',
    'SUCCESS': 'सफल', 'YOUR LOCATION IS READY': 'आपकी लोकेशन तैयार है', 'YOUR DIGIPIN': 'आपका DIGIPIN', 'Your 10-character digital location code is ready to copy and share.': 'आपका 10 अक्षरों का डिजिटल लोकेशन कोड कॉपी और साझा करने के लिए तैयार है।', 'Copied!': 'कॉपी हो गया!', 'Copy DIGIPIN': 'DIGIPIN कॉपी करें', 'COORDINATES': 'निर्देशांक', 'LOCATION COORDINATES': 'स्थान के निर्देशांक', 'LAT': 'अक्षांश', 'LON': 'देशांतर', 'These coordinates represent the centre point of the DIGIPIN grid cell.': 'ये निर्देशांक DIGIPIN ग्रिड सेल के केंद्र बिंदु को दर्शाते हैं।', 'Copy coordinates': 'निर्देशांक कॉपी करें', 'Open in Google Maps': 'Google Maps में खोलें',
    'A SMALL CODE. A BIG POSSIBILITY.': 'छोटा कोड। बड़ी संभावना।', 'Location, simplified in': 'स्थान को आसान बनाएं', 'three steps.': 'तीन चरणों में।', 'STEP 01': 'चरण 01', 'Choose a place': 'स्थान चुनें', 'Start with coordinates or use your device’s current location.': 'निर्देशांक दर्ज करें या अपने डिवाइस की मौजूदा लोकेशन लें।', 'STEP 02': 'चरण 02', 'Generate a DIGIPIN': 'DIGIPIN बनाएं', 'The official open-source algorithm maps the point into a compact code.': 'आधिकारिक ओपन-सोर्स एल्गोरिदम स्थान को छोटे कोड में बदलता है।', 'STEP 03': 'चरण 03', 'Share with confidence': 'आसानी से साझा करें', 'Copy your code or decode an existing DIGIPIN into coordinates.': 'कोड कॉपी करें या मौजूदा DIGIPIN को निर्देशांकों में बदलें।',
    'BUILT ON OPEN SOURCE': 'ओपन सोर्स पर आधारित', 'Designed for a more connected India.': 'एक अधिक जुड़ा हुआ भारत बनाने के लिए।', 'DIGIPIN is a geospatial addressing grid initiative by the Department of Posts, Government of India. This independent explorer uses the published open-source implementation to make its encoding and decoding functions easier to try.': 'DIGIPIN, भारत सरकार के डाक विभाग की भू-स्थानिक पता ग्रिड पहल है। यह स्वतंत्र एक्सप्लोरर प्रकाशित ओपन-सोर्स कार्यान्वयन का उपयोग करके कोड बनाने और डिकोड करने की सुविधा देता है।', 'Explore the official repository': 'आधिकारिक रिपॉज़िटरी देखें', 'DIGIPIN EXPLORER': 'DIGIPIN एक्सप्लोरर', 'Independent community interface · Not an official India Post website': 'स्वतंत्र सामुदायिक इंटरफ़ेस · यह India Post की आधिकारिक वेबसाइट नहीं है', 'Open-source foundation': 'ओपन-सोर्स आधार', 'Toggle navigation': 'नेविगेशन खोलें/बंद करें', 'DIGIPIN Explorer home': 'DIGIPIN Explorer होम',
    'Your browser does not support location.': 'आपका ब्राउज़र लोकेशन सुविधा का समर्थन नहीं करता।', 'Location access was denied. Allow location permission and try again.': 'लोकेशन अनुमति अस्वीकार हुई। अनुमति देकर फिर कोशिश करें।', 'Could not detect your location. Check your device location and try again.': 'आपकी लोकेशन नहीं मिल सकी। डिवाइस की लोकेशन सेटिंग जांचकर फिर कोशिश करें।', 'Clipboard access is unavailable. Please copy the text manually.': 'क्लिपबोर्ड उपलब्ध नहीं है। कृपया टेक्स्ट मैन्युअल रूप से कॉपी करें।', 'Something went wrong. Please try again.': 'कुछ गड़बड़ हुई। कृपया फिर कोशिश करें।',
    'DIGIPIN API did not return JSON. Check that both services are running with `npm run dev`. Expected API server on port 5001. ': 'DIGIPIN API ने JSON नहीं लौटाया। सेवाओं और API URL की जांच करें। ', 'Empty response': 'खाली जवाब', 'Illustration of a digital location grid': 'डिजिटल स्थान ग्रिड का चित्र', 'e.g. 28.6139': 'उदा. 28.6139', 'e.g. 77.2090': 'उदा. 77.2090', 'e.g. 4T396F42L7': 'उदा. 4T396F42L7'
  },
  ta: {
    'A new address for': 'ஒரு புதிய முகவரி', 'Digital India.': 'டிஜிட்டல் இந்தியாவிற்காக.', 'DEPARTMENT OF POSTS · GOVERNMENT OF INDIA': 'அஞ்சல் துறை · இந்திய அரசு', 'CONNECTING EVERY CORNER OF INDIA': 'இந்தியாவின் ஒவ்வொரு மூலையையும் இணைக்கிறது', 'Dak Sewa · Jan Sewa': 'அஞ்சல் சேவை · மக்கள் சேவை',
    'A digital addressing initiative inspired by India’s geospatial future': 'இந்தியாவின் புவியியல் எதிர்காலத்தால் ஊக்கமளிக்கப்பட்ட டிஜிட்டல் முகவரி முயற்சி', 'A location, made precise.': 'ஒவ்வொரு இடத்திற்கும் துல்லியமான முகவரி.', 'Explore': 'ஆராய்க', 'How it works': 'இது எப்படி செயல்படுகிறது', 'About DIGIPIN': 'DIGIPIN பற்றி', 'Official source': 'அதிகாரப்பூர்வ மூலம்', 'THE NEW LANGUAGE OF LOCATION': 'இடத்தின் புதிய மொழி', 'Every place has a story.': 'ஒவ்வொரு இடத்திற்கும் ஒரு கதை உண்டு.', 'Give it an address.': 'அதற்கு ஒரு முகவரி கொடுங்கள்.',
    'Turn coordinates into a precise digital address. Explore India’s geospatial grid with DIGIPIN — built to make every location easier to identify and share.': 'ஆயத்தொலைவுகளைத் துல்லியமான டிஜிட்டல் முகவரியாக மாற்றுங்கள். DIGIPIN மூலம் இந்தியாவின் புவியியல் கட்டமைப்பை ஆராய்ந்து இடங்களை எளிதாக அடையாளம் கண்டு பகிருங்கள்.', 'Find your DIGIPIN': 'உங்கள் DIGIPIN-ஐ கண்டறியுங்கள்', 'Discover how it works': 'இது எப்படி செயல்படுகிறது என அறியுங்கள்', 'Open-source technology': 'திறந்த மூலத் தொழில்நுட்பம்', '10-character location code': '10 எழுத்து இடக் குறியீடு', 'LOCATION FOUND': 'இடம் கண்டறியப்பட்டது', 'YOUR DIGITAL ADDRESS': 'உங்கள் டிஜிட்டல் முகவரி', 'PREVIEW': 'முன்னோட்டம்', 'INDIA · GRID 01': 'இந்தியா · கிரிட் 01', 'PRECISION IN EVERY POINT': 'ஒவ்வொரு புள்ளியிலும் துல்லியம்',
    'YOUR LOCATION, DECODED': 'உங்கள் இடம், விளக்கப்பட்டது', 'Explore DIGIPIN': 'DIGIPIN-ஐ ஆராயுங்கள்', 'Generate a code from coordinates, or decode a code to find its location.': 'ஆயத்தொலைவுகளிலிருந்து குறியீட்டை உருவாக்கவும் அல்லது குறியீட்டிலிருந்து இடத்தைக் கண்டறியவும்.', 'Simple. Precise. Shareable.': 'எளிமை. துல்லியம். பகிரலாம்.', 'Generate DIGIPIN': 'DIGIPIN உருவாக்கு', 'Decode a code': 'குறியீட்டை விளக்கு', 'Enter coordinates': 'ஆயத்தொலைவுகளை உள்ளிடவும்', 'Use a latitude and longitude pair.': 'அட்சரேகை மற்றும் தீர்க்கரேகையை உள்ளிடவும்.', 'Use my location': 'எனது இடத்தைப் பயன்படுத்து', 'Finding you…': 'உங்கள் இடத்தைக் கண்டறிகிறது…', 'Your location is ready': 'உங்கள் இடம் தயார்', 'Latitude': 'அட்சரேகை', 'Longitude': 'தீர்க்கரேகை', 'India grid coverage: approximately 2.5°–38.5° N and 63.5°–99.5° E.': 'இந்திய கிரிட் வரம்பு: சுமார் 2.5°–38.5° வடக்கு மற்றும் 63.5°–99.5° கிழக்கு.',
    'Enter a DIGIPIN code': 'DIGIPIN குறியீட்டை உள்ளிடவும்', 'Use the continuous 10-character code.': 'இடைவெளியில்லாத 10 எழுத்துக் குறியீட்டைப் பயன்படுத்தவும்.', '10 characters': '10 எழுத்துகள்', 'Accepted characters: 2–9, C, J, K, L, M, P, F and T.': 'ஏற்கப்படும் எழுத்துகள்: 2–9, C, J, K, L, M, P, F மற்றும் T.', 'Working…': 'செயல்படுகிறது…', 'Generate my DIGIPIN': 'எனது DIGIPIN உருவாக்கு', 'Find this location': 'இந்த இடத்தைக் கண்டறி', 'YOUR RESULT WILL APPEAR HERE': 'உங்கள் முடிவு இங்கே தோன்றும்', 'Ready when you are.': 'நீங்கள் தயாரானதும் தொடங்கலாம்.', 'Enter your details and we’ll translate your location into a digital address.': 'விவரங்களை உள்ளிட்டு உங்கள் இடத்தை டிஜிட்டல் முகவரியாக மாற்றுங்கள்.', 'Processed using the official open-source algorithm': 'அதிகாரப்பூர்வ திறந்த மூல அல்காரிதம் பயன்படுத்தப்பட்டது',
    'SUCCESS': 'வெற்றி', 'YOUR LOCATION IS READY': 'உங்கள் இடம் தயார்', 'YOUR DIGIPIN': 'உங்கள் DIGIPIN', 'Your 10-character digital location code is ready to copy and share.': 'உங்கள் 10 எழுத்து டிஜிட்டல் இடக் குறியீடு நகலெடுத்து பகிரத் தயாராக உள்ளது.', 'Copied!': 'நகலெடுக்கப்பட்டது!', 'Copy DIGIPIN': 'DIGIPIN நகலெடு', 'COORDINATES': 'ஆயத்தொலைவுகள்', 'LOCATION COORDINATES': 'இட ஆயத்தொலைவுகள்', 'LAT': 'அட்சரேகை', 'LON': 'தீர்க்கரேகை', 'These coordinates represent the centre point of the DIGIPIN grid cell.': 'இந்த ஆயத்தொலைவுகள் DIGIPIN கிரிட் கலத்தின் மையப் புள்ளியைக் குறிக்கின்றன.', 'Copy coordinates': 'ஆயத்தொலைவுகளை நகலெடு', 'Open in Google Maps': 'Google Maps-இல் திற',
    'A SMALL CODE. A BIG POSSIBILITY.': 'சிறிய குறியீடு. பெரிய வாய்ப்பு.', 'Location, simplified in': 'இடத்தை எளிமையாக்கலாம்', 'three steps.': 'மூன்று படிகளில்.', 'STEP 01': 'படி 01', 'Choose a place': 'ஒரு இடத்தைத் தேர்ந்தெடு', 'Start with coordinates or use your device’s current location.': 'ஆயத்தொலைவுகளுடன் தொடங்கவும் அல்லது சாதனத்தின் தற்போதைய இடத்தைப் பயன்படுத்தவும்.', 'STEP 02': 'படி 02', 'Generate a DIGIPIN': 'DIGIPIN உருவாக்கு', 'The official open-source algorithm maps the point into a compact code.': 'அதிகாரப்பூர்வ திறந்த மூல அல்காரிதம் அந்த இடத்தைச் சுருக்கமான குறியீடாக மாற்றுகிறது.', 'STEP 03': 'படி 03', 'Share with confidence': 'நம்பிக்கையுடன் பகிரவும்', 'Copy your code or decode an existing DIGIPIN into coordinates.': 'குறியீட்டை நகலெடுக்கவும் அல்லது DIGIPIN-ஐ ஆயத்தொலைவுகளாக மாற்றவும்.',
    'BUILT ON OPEN SOURCE': 'திறந்த மூல அடிப்படையில்', 'Designed for a more connected India.': 'மேலும் இணைந்த இந்தியாவிற்காக வடிவமைக்கப்பட்டது.', 'DIGIPIN is a geospatial addressing grid initiative by the Department of Posts, Government of India. This independent explorer uses the published open-source implementation to make its encoding and decoding functions easier to try.': 'DIGIPIN என்பது இந்திய அரசின் அஞ்சல் துறையின் புவியியல் முகவரி கிரிட் முயற்சியாகும். இந்த சுயாதீன எக்ஸ்ப்ளோரர் வெளியிடப்பட்ட திறந்த மூல செயலாக்கத்தைப் பயன்படுத்தி குறியீடு உருவாக்கம் மற்றும் விளக்கத்தை எளிதாக்குகிறது.', 'Explore the official repository': 'அதிகாரப்பூர்வ களஞ்சியத்தைப் பாருங்கள்', 'DIGIPIN EXPLORER': 'DIGIPIN எக்ஸ்ப்ளோரர்', 'Independent community interface · Not an official India Post website': 'சுயாதீன சமூக இடைமுகம் · இது அதிகாரப்பூர்வ India Post இணையதளம் அல்ல', 'Open-source foundation': 'திறந்த மூல அடித்தளம்', 'Toggle navigation': 'வழிசெலுத்தலை மாற்று', 'DIGIPIN Explorer home': 'DIGIPIN Explorer முகப்பு',
    'Your browser does not support location.': 'உங்கள் உலாவி இருப்பிட வசதியை ஆதரிக்கவில்லை.', 'Location access was denied. Allow location permission and try again.': 'இருப்பிட அனுமதி மறுக்கப்பட்டது. அனுமதி வழங்கி மீண்டும் முயற்சிக்கவும்.', 'Could not detect your location. Check your device location and try again.': 'உங்கள் இருப்பிடத்தைக் கண்டறிய முடியவில்லை. சாதன இருப்பிட அமைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.', 'Clipboard access is unavailable. Please copy the text manually.': 'கிளிப்போர்டு கிடைக்கவில்லை. உரையை கைமுறையாக நகலெடுக்கவும்.', 'Something went wrong. Please try again.': 'ஏதோ தவறு ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.', 'DIGIPIN API did not return JSON. Check that both services are running with `npm run dev`. Expected API server on port 5001. ': 'DIGIPIN API JSON தரவில்லை. சேவைகள் மற்றும் API முகவரியைச் சரிபார்க்கவும். ', 'Empty response': 'வெற்று பதில்', 'Illustration of a digital location grid': 'டிஜிட்டல் இடக் கிரிட் விளக்கம்', 'e.g. 28.6139': 'எ.கா. 28.6139', 'e.g. 77.2090': 'எ.கா. 77.2090', 'e.g. 4T396F42L7': 'எ.கா. 4T396F42L7'
  },
  te: {
    'A new address for': 'ఒక కొత్త చిరునామా', 'Digital India.': 'డిజిటల్ ఇండియా కోసం.', 'DEPARTMENT OF POSTS · GOVERNMENT OF INDIA': 'తపాలా శాఖ · భారత ప్రభుత్వం', 'CONNECTING EVERY CORNER OF INDIA': 'భారతదేశంలోని ప్రతి మూలను కలుపుతూ', 'Dak Sewa · Jan Sewa': 'డాక్ సేవా · జన సేవా',
    'A digital addressing initiative inspired by India’s geospatial future': 'భారతదేశ భౌగోళిక భవిష్యత్తు స్ఫూర్తితో డిజిటల్ చిరునామా కార్యక్రమం', 'A location, made precise.': 'ప్రతి ప్రదేశానికి ఖచ్చితమైన చిరునామా.', 'Explore': 'అన్వేషించండి', 'How it works': 'ఇది ఎలా పనిచేస్తుంది', 'About DIGIPIN': 'DIGIPIN గురించి', 'Official source': 'అధికారిక మూలం', 'THE NEW LANGUAGE OF LOCATION': 'ప్రదేశానికి కొత్త భాష', 'Every place has a story.': 'ప్రతి ప్రదేశానికీ ఒక కథ ఉంది.', 'Give it an address.': 'దానికి చిరునామా ఇవ్వండి.',
    'Turn coordinates into a precise digital address. Explore India’s geospatial grid with DIGIPIN — built to make every location easier to identify and share.': 'కోఆర్డినేట్‌లను ఖచ్చితమైన డిజిటల్ చిరునామాగా మార్చండి. DIGIPINతో భారతదేశ భౌగోళిక గ్రిడ్‌ను అన్వేషించి, ప్రతి ప్రదేశాన్ని సులభంగా గుర్తించి పంచుకోండి.', 'Find your DIGIPIN': 'మీ DIGIPIN కనుగొనండి', 'Discover how it works': 'ఇది ఎలా పనిచేస్తుందో తెలుసుకోండి', 'Open-source technology': 'ఓపెన్-సోర్స్ సాంకేతికత', '10-character location code': '10 అక్షరాల స్థాన కోడ్', 'LOCATION FOUND': 'ప్రదేశం కనుగొనబడింది', 'YOUR DIGITAL ADDRESS': 'మీ డిజిటల్ చిరునామా', 'PREVIEW': 'ప్రివ్యూ', 'INDIA · GRID 01': 'భారతదేశం · గ్రిడ్ 01', 'PRECISION IN EVERY POINT': 'ప్రతి బిందువులో ఖచ్చితత్వం',
    'YOUR LOCATION, DECODED': 'మీ స్థానం వివరించబడింది', 'Explore DIGIPIN': 'DIGIPIN అన్వేషించండి', 'Generate a code from coordinates, or decode a code to find its location.': 'కోఆర్డినేట్‌లతో కోడ్ రూపొందించండి లేదా కోడ్ ద్వారా స్థానం కనుగొనండి.', 'Simple. Precise. Shareable.': 'సరళం. ఖచ్చితం. పంచుకోదగినది.', 'Generate DIGIPIN': 'DIGIPIN రూపొందించండి', 'Decode a code': 'కోడ్ డీకోడ్ చేయండి', 'Enter coordinates': 'కోఆర్డినేట్‌లు నమోదు చేయండి', 'Use a latitude and longitude pair.': 'అక్షాంశం, రేఖాంశం జతను ఉపయోగించండి.', 'Use my location': 'నా స్థానాన్ని ఉపయోగించండి', 'Finding you…': 'మీ స్థానాన్ని కనుగొంటోంది…', 'Your location is ready': 'మీ స్థానం సిద్ధంగా ఉంది', 'Latitude': 'అక్షాంశం', 'Longitude': 'రేఖాంశం', 'India grid coverage: approximately 2.5°–38.5° N and 63.5°–99.5° E.': 'భారత గ్రిడ్ పరిధి: సుమారు 2.5°–38.5° ఉత్తరం, 63.5°–99.5° తూర్పు.',
    'Enter a DIGIPIN code': 'DIGIPIN కోడ్ నమోదు చేయండి', 'Use the continuous 10-character code.': 'ఖాళీలు లేని 10 అక్షరాల కోడ్ ఉపయోగించండి.', '10 characters': '10 అక్షరాలు', 'Accepted characters: 2–9, C, J, K, L, M, P, F and T.': 'అంగీకరించే అక్షరాలు: 2–9, C, J, K, L, M, P, F మరియు T.', 'Working…': 'పని జరుగుతోంది…', 'Generate my DIGIPIN': 'నా DIGIPIN రూపొందించండి', 'Find this location': 'ఈ స్థానాన్ని కనుగొనండి', 'YOUR RESULT WILL APPEAR HERE': 'మీ ఫలితం ఇక్కడ కనిపిస్తుంది', 'Ready when you are.': 'మీరు సిద్ధమైనప్పుడు ప్రారంభించండి.', 'Enter your details and we’ll translate your location into a digital address.': 'వివరాలు నమోదు చేసి మీ స్థానాన్ని డిజిటల్ చిరునామాగా మార్చండి.', 'Processed using the official open-source algorithm': 'అధికారిక ఓపెన్-సోర్స్ అల్గోరిథమ్‌తో ప్రాసెస్ చేయబడింది',
    'SUCCESS': 'విజయం', 'YOUR LOCATION IS READY': 'మీ స్థానం సిద్ధంగా ఉంది', 'YOUR DIGIPIN': 'మీ DIGIPIN', 'Your 10-character digital location code is ready to copy and share.': 'మీ 10 అక్షరాల డిజిటల్ స్థాన కోడ్ కాపీ చేసి పంచుకోవడానికి సిద్ధంగా ఉంది.', 'Copied!': 'కాపీ అయింది!', 'Copy DIGIPIN': 'DIGIPIN కాపీ చేయండి', 'COORDINATES': 'కోఆర్డినేట్‌లు', 'LOCATION COORDINATES': 'స్థాన కోఆర్డినేట్‌లు', 'LAT': 'అక్షాంశం', 'LON': 'రేఖాంశం', 'These coordinates represent the centre point of the DIGIPIN grid cell.': 'ఈ కోఆర్డినేట్‌లు DIGIPIN గ్రిడ్ సెల్ మధ్య బిందువును సూచిస్తాయి.', 'Copy coordinates': 'కోఆర్డినేట్‌లు కాపీ చేయండి', 'Open in Google Maps': 'Google Mapsలో తెరవండి',
    'A SMALL CODE. A BIG POSSIBILITY.': 'చిన్న కోడ్. పెద్ద అవకాశం.', 'Location, simplified in': 'స్థానాన్ని సులభం చేయండి', 'three steps.': 'మూడు దశల్లో.', 'STEP 01': 'దశ 01', 'Choose a place': 'ఒక ప్రదేశాన్ని ఎంచుకోండి', 'Start with coordinates or use your device’s current location.': 'కోఆర్డినేట్‌లతో ప్రారంభించండి లేదా మీ పరికరం ప్రస్తుత స్థానాన్ని ఉపయోగించండి.', 'STEP 02': 'దశ 02', 'Generate a DIGIPIN': 'DIGIPIN రూపొందించండి', 'The official open-source algorithm maps the point into a compact code.': 'అధికారిక ఓపెన్-సోర్స్ అల్గోరిథమ్ ఆ బిందువును చిన్న కోడ్‌గా మారుస్తుంది.', 'STEP 03': 'దశ 03', 'Share with confidence': 'నమ్మకంగా పంచుకోండి', 'Copy your code or decode an existing DIGIPIN into coordinates.': 'మీ కోడ్ కాపీ చేయండి లేదా ఉన్న DIGIPINను కోఆర్డినేట్‌లుగా మార్చండి.',
    'BUILT ON OPEN SOURCE': 'ఓపెన్ సోర్స్ ఆధారంగా', 'Designed for a more connected India.': 'మరింత అనుసంధానమైన భారతదేశం కోసం రూపొందించబడింది.', 'DIGIPIN is a geospatial addressing grid initiative by the Department of Posts, Government of India. This independent explorer uses the published open-source implementation to make its encoding and decoding functions easier to try.': 'DIGIPIN అనేది భారత ప్రభుత్వ తపాలా శాఖకు చెందిన భౌగోళిక చిరునామా గ్రిడ్ కార్యక్రమం. ఈ స్వతంత్ర ఎక్స్‌ప్లోరర్ ప్రచురించిన ఓపెన్-సోర్స్ అమలును ఉపయోగించి కోడ్ రూపొందించడం, డీకోడ్ చేయడం సులభం చేస్తుంది.', 'Explore the official repository': 'అధికారిక రిపాజిటరీ చూడండి', 'DIGIPIN EXPLORER': 'DIGIPIN ఎక్స్‌ప్లోరర్', 'Independent community interface · Not an official India Post website': 'స్వతంత్ర కమ్యూనిటీ ఇంటర్‌ఫేస్ · ఇది అధికారిక India Post వెబ్‌సైట్ కాదు', 'Open-source foundation': 'ఓపెన్-సోర్స్ ఆధారం', 'Toggle navigation': 'నావిగేషన్ మార్చండి', 'DIGIPIN Explorer home': 'DIGIPIN Explorer హోమ్',
    'Your browser does not support location.': 'మీ బ్రౌజర్ స్థాన సేవకు మద్దతు ఇవ్వదు.', 'Location access was denied. Allow location permission and try again.': 'స్థాన అనుమతి నిరాకరించబడింది. అనుమతి ఇచ్చి మళ్లీ ప్రయత్నించండి.', 'Could not detect your location. Check your device location and try again.': 'మీ స్థానాన్ని గుర్తించలేకపోయాం. పరికరం స్థాన సెట్టింగ్‌ను తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.', 'Clipboard access is unavailable. Please copy the text manually.': 'క్లిప్‌బోర్డ్ అందుబాటులో లేదు. దయచేసి టెక్స్ట్‌ను చేతితో కాపీ చేయండి.', 'Something went wrong. Please try again.': 'ఏదో తప్పు జరిగింది. మళ్లీ ప్రయత్నించండి.', 'DIGIPIN API did not return JSON. Check that both services are running with `npm run dev`. Expected API server on port 5001. ': 'DIGIPIN API JSON ఇవ్వలేదు. సేవలు మరియు API చిరునామాను తనిఖీ చేయండి. ', 'Empty response': 'ఖాళీ ప్రతిస్పందన', 'Illustration of a digital location grid': 'డిజిటల్ స్థాన గ్రిడ్ చిత్రం', 'e.g. 28.6139': 'ఉదా. 28.6139', 'e.g. 77.2090': 'ఉదా. 77.2090', 'e.g. 4T396F42L7': 'ఉదా. 4T396F42L7'
  },
  mr: {
    "A new address for": "एक नवीन पत्ता",
    "Digital India.": "डिजिटल भारतासाठी.",
    "DEPARTMENT OF POSTS · GOVERNMENT OF INDIA": "डाक विभाग · भारत सरकार",
    "CONNECTING EVERY CORNER OF INDIA": "भारताच्या प्रत्येक कोपऱ्याला जोडणारे",
    "Dak Sewa · Jan Sewa": "डाक सेवा · जन सेवा",
    "A digital addressing initiative inspired by India’s geospatial future": "भारताच्या भू-स्थानिक भविष्याने प्रेरित डिजिटल पत्ता उपक्रम",
    "A location, made precise.": "प्रत्येक ठिकाणाचा अचूक पत्ता.",
    "Explore": "पाहा",
    "How it works": "हे कसे कार्य करते",
    "About DIGIPIN": "DIGIPIN बद्दल",
    "Official source": "अधिकृत स्रोत",
    "THE NEW LANGUAGE OF LOCATION": "स्थानाची नवी भाषा",
    "Every place has a story.": "प्रत्येक ठिकाणाची एक गोष्ट असते.",
    "Give it an address.": "त्याला एक पत्ता द्या.",
    "Turn coordinates into a precise digital address. Explore India’s geospatial grid with DIGIPIN — built to make every location easier to identify and share.": "अक्षांश-रेखांशाचे अचूक डिजिटल पत्त्यात रूपांतर करा. DIGIPIN द्वारे भारताचा भू-स्थानिक ग्रिड जाणून घ्या आणि प्रत्येक ठिकाण सहज ओळखा व शेअर करा.",
    "Find your DIGIPIN": "तुमचा DIGIPIN शोधा",
    "Discover how it works": "हे कसे कार्य करते ते जाणून घ्या",
    "Open-source technology": "ओपन-सोर्स तंत्रज्ञान",
    "10-character location code": "१० अक्षरांचा स्थान कोड",
    "LOCATION FOUND": "स्थान सापडले",
    "YOUR DIGITAL ADDRESS": "तुमचा डिजिटल पत्ता",
    "PREVIEW": "पूर्वावलोकन",
    "INDIA · GRID 01": "भारत · ग्रिड ०१",
    "PRECISION IN EVERY POINT": "प्रत्येक बिंदूवर अचूकता",
    "YOUR LOCATION, DECODED": "तुमचे स्थान उलगडले",
    "Explore DIGIPIN": "DIGIPIN पाहा",
    "Generate a code from coordinates, or decode a code to find its location.": "अक्षांश-रेखांशावरून कोड तयार करा किंवा कोडवरून त्याचे स्थान शोधा.",
    "Simple. Precise. Shareable.": "सोपे. अचूक. शेअर करण्यायोग्य.",
    "Generate DIGIPIN": "DIGIPIN तयार करा",
    "Decode a code": "कोड डिकोड करा",
    "Enter coordinates": "अक्षांश-रेखांश भरा",
    "Use a latitude and longitude pair.": "अक्षांश आणि रेखांशाची जोडी वापरा.",
    "Use my location": "माझे स्थान वापरा",
    "Finding you…": "तुमचे स्थान शोधत आहोत…",
    "Your location is ready": "तुमचे स्थान तयार आहे",
    "Latitude": "अक्षांश",
    "Longitude": "रेखांश",
    "India grid coverage: approximately 2.5°–38.5° N and 63.5°–99.5° E.": "भारताच्या ग्रिडची व्याप्ती: अंदाजे २.५°–३८.५° उत्तर आणि ६३.५°–९९.५° पूर्व.",
    "Enter a DIGIPIN code": "DIGIPIN कोड भरा",
    "Use the continuous 10-character code.": "मधेमध्ये जागा नसलेला १० अक्षरांचा कोड वापरा.",
    "10 characters": "१० अक्षरे",
    "Accepted characters: 2–9, C, J, K, L, M, P, F and T.": "मान्य अक्षरे: 2–9, C, J, K, L, M, P, F आणि T.",
    "Working…": "प्रक्रिया सुरू आहे…",
    "Generate my DIGIPIN": "माझा DIGIPIN तयार करा",
    "Find this location": "हे स्थान शोधा",
    "YOUR RESULT WILL APPEAR HERE": "तुमचा निकाल येथे दिसेल",
    "Ready when you are.": "तुम्ही तयार असाल तेव्हा सुरू करा.",
    "Enter your details and we’ll translate your location into a digital address.": "तुमची माहिती भरा आणि तुमच्या स्थानाचे डिजिटल पत्त्यात रूपांतर करा.",
    "Processed using the official open-source algorithm": "अधिकृत ओपन-सोर्स अल्गोरिदम वापरून प्रक्रिया केली",
    "SUCCESS": "यशस्वी",
    "YOUR LOCATION IS READY": "तुमचे स्थान तयार आहे",
    "YOUR DIGIPIN": "तुमचा DIGIPIN",
    "Your 10-character digital location code is ready to copy and share.": "तुमचा १० अक्षरांचा डिजिटल स्थान कोड कॉपी आणि शेअर करण्यासाठी तयार आहे.",
    "Copied!": "कॉपी झाले!",
    "Copy DIGIPIN": "DIGIPIN कॉपी करा",
    "COORDINATES": "निर्देशांक",
    "LOCATION COORDINATES": "स्थानाचे निर्देशांक",
    "LAT": "अक्षांश",
    "LON": "रेखांश",
    "These coordinates represent the centre point of the DIGIPIN grid cell.": "हे निर्देशांक DIGIPIN ग्रिड सेलचा मध्यबिंदू दर्शवतात.",
    "Copy coordinates": "निर्देशांक कॉपी करा",
    "Open in Google Maps": "Google Maps मध्ये उघडा",
    "A SMALL CODE. A BIG POSSIBILITY.": "छोटा कोड. मोठी शक्यता.",
    "Location, simplified in": "स्थान अधिक सोपे,",
    "three steps.": "तीन टप्प्यांत.",
    "STEP 01": "टप्पा ०१",
    "Choose a place": "ठिकाण निवडा",
    "Start with coordinates or use your device’s current location.": "निर्देशांकांपासून सुरुवात करा किंवा तुमच्या डिव्हाइसचे सध्याचे स्थान वापरा.",
    "STEP 02": "टप्पा ०२",
    "Generate a DIGIPIN": "DIGIPIN तयार करा",
    "The official open-source algorithm maps the point into a compact code.": "अधिकृत ओपन-सोर्स अल्गोरिदम त्या बिंदूचे संक्षिप्त कोडमध्ये रूपांतर करतो.",
    "STEP 03": "टप्पा ०३",
    "Share with confidence": "विश्वासाने शेअर करा",
    "Copy your code or decode an existing DIGIPIN into coordinates.": "तुमचा कोड कॉपी करा किंवा विद्यमान DIGIPIN चे निर्देशांकांमध्ये रूपांतर करा.",
    "BUILT ON OPEN SOURCE": "ओपन सोर्सवर आधारित",
    "Designed for a more connected India.": "अधिक जोडलेल्या भारतासाठी तयार केलेले.",
    "DIGIPIN is a geospatial addressing grid initiative by the Department of Posts, Government of India. This independent explorer uses the published open-source implementation to make its encoding and decoding functions easier to try.": "DIGIPIN हा भारत सरकारच्या डाक विभागाचा भू-स्थानिक पत्ता ग्रिड उपक्रम आहे. हा स्वतंत्र एक्सप्लोरर प्रकाशित ओपन-सोर्स अंमलबजावणीचा वापर करून कोड तयार करणे आणि डिकोड करणे सोपे करतो.",
    "Explore the official repository": "अधिकृत रिपॉझिटरी पाहा",
    "DIGIPIN EXPLORER": "DIGIPIN एक्सप्लोरर",
    "Independent community interface · Not an official India Post website": "स्वतंत्र समुदाय इंटरफेस · India Post ची अधिकृत वेबसाइट नाही",
    "Open-source foundation": "ओपन-सोर्स पाया",
    "Toggle navigation": "नेव्हिगेशन उघडा/बंद करा",
    "DIGIPIN Explorer home": "DIGIPIN Explorer मुख्यपृष्ठ",
    "Your browser does not support location.": "तुमचा ब्राउझर स्थान सुविधा समर्थित करत नाही.",
    "Location access was denied. Allow location permission and try again.": "स्थानाची परवानगी नाकारली गेली. परवानगी द्या आणि पुन्हा प्रयत्न करा.",
    "Could not detect your location. Check your device location and try again.": "तुमचे स्थान शोधता आले नाही. डिव्हाइसची स्थान सेटिंग तपासून पुन्हा प्रयत्न करा.",
    "Clipboard access is unavailable. Please copy the text manually.": "क्लिपबोर्ड उपलब्ध नाही. कृपया मजकूर स्वतः कॉपी करा.",
    "Something went wrong. Please try again.": "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.",
    "DIGIPIN API did not return JSON. Check that both services are running with `npm run dev`. Expected API server on port 5001. ": "DIGIPIN API कडून JSON प्रतिसाद मिळाला नाही. सेवा आणि API पत्ता तपासा. ",
    "Empty response": "रिकामा प्रतिसाद",
    "Illustration of a digital location grid": "डिजिटल स्थान ग्रिडचे चित्र",
    "e.g. 28.6139": "उदा. 28.6139",
    "e.g. 77.2090": "उदा. 77.2090",
    "e.g. 4T396F42L7": "उदा. 4T396F42L7"
  }
};

const extraTranslations = {
  en: {
    'Share on WhatsApp': 'Share on WhatsApp',
    'I’m sharing my DIGIPIN digital address:': 'I’m sharing my DIGIPIN digital address:',
    'Explore DIGIPIN Explorer:': 'Explore DIGIPIN Explorer:',
    'Choose language': 'Choose language',
    'Current language': 'Current language',
    'EXPLORE THE MAP': 'EXPLORE THE MAP',
    'Map your DIGIPIN': 'Map your DIGIPIN',
    'See a DIGIPIN cell on the map and plan a road route between two digital addresses.': 'See a DIGIPIN cell on the map and plan a road route between two digital addresses.',
    'Interactive map': 'Interactive map',
    'DIGIPIN cell': 'DIGIPIN cell',
    'Road route': 'Road route',
    'DIGIPIN ROUTE PLANNER': 'DIGIPIN ROUTE PLANNER',
    'Find a road route': 'Find a road route',
    'Enter the starting and destination DIGIPIN. We will decode both and draw a route on the map.': 'Enter the starting and destination DIGIPIN. We will decode both and draw a route on the map.',
    'Starting DIGIPIN': 'Starting DIGIPIN',
    'Destination DIGIPIN': 'Destination DIGIPIN',
    'Route preference': 'Route preference',
    'Shortest distance': 'Shortest distance',
    'Fastest route': 'Fastest route',
    'Calculating route…': 'Calculating route…',
    'Show route on map': 'Show route on map',
    'Route found': 'Route found',
    'Road distance': 'Road distance',
    'Estimated drive time': 'Estimated drive time',
    'Open navigation in Google Maps': 'Open navigation in Google Maps',
    'Route estimates depend on available road data and may differ from live traffic navigation.': 'Route estimates depend on available road data and may differ from live traffic navigation.',
    'Routing service': 'Routing service',
    'OpenRouteService · shortest / fastest road routing': 'OpenRouteService · shortest / fastest road routing',
    'The marker shows the DIGIPIN cell centre, not necessarily a building entrance. Map tiles © OpenStreetMap contributors.': 'The marker shows the DIGIPIN cell centre, not necessarily a building entrance. Map tiles © OpenStreetMap contributors.',
    'DIGIPIN location': 'DIGIPIN location',
    'Coordinates only': 'Coordinates only',
    'Route origin': 'Route origin',
    'Route destination': 'Route destination',
    'Enter two valid 10-character DIGIPINs.': 'Enter two valid 10-character DIGIPINs.',
    'Could not calculate this route. Please try again.': 'Could not calculate this route. Please try again.',
    'Interactive DIGIPIN map': 'Interactive DIGIPIN map'
  },
  hi: {
    'Share on WhatsApp': 'WhatsApp पर साझा करें',
    'I’m sharing my DIGIPIN digital address:': 'मैं अपना DIGIPIN डिजिटल पता साझा कर रहा/रही हूँ:',
    'Explore DIGIPIN Explorer:': 'DIGIPIN Explorer देखें:',
    'Choose language': 'भाषा चुनें',
    'Current language': 'वर्तमान भाषा',
    'EXPLORE THE MAP': 'मैप देखें',
    'Map your DIGIPIN': 'अपने DIGIPIN को मैप पर देखें',
    'See a DIGIPIN cell on the map and plan a road route between two digital addresses.': 'मैप पर DIGIPIN सेल देखें और दो डिजिटल पतों के बीच सड़क मार्ग खोजें।',
    'Interactive map': 'इंटरैक्टिव मैप',
    'DIGIPIN cell': 'DIGIPIN सेल',
    'Road route': 'सड़क मार्ग',
    'DIGIPIN ROUTE PLANNER': 'DIGIPIN मार्ग योजनाकार',
    'Find a road route': 'सड़क मार्ग खोजें',
    'Enter the starting and destination DIGIPIN. We will decode both and draw a route on the map.': 'शुरुआती और गंतव्य DIGIPIN दर्ज करें। हम दोनों को डिकोड करके मैप पर मार्ग दिखाएंगे।',
    'Starting DIGIPIN': 'शुरुआती DIGIPIN',
    'Destination DIGIPIN': 'गंतव्य DIGIPIN',
    'Route preference': 'मार्ग का प्रकार',
    'Shortest distance': 'सबसे कम दूरी',
    'Fastest route': 'सबसे तेज़ मार्ग',
    'Calculating route…': 'मार्ग निकाला जा रहा है…',
    'Show route on map': 'मैप पर मार्ग दिखाएं',
    'Route found': 'मार्ग मिल गया',
    'Road distance': 'सड़क की दूरी',
    'Estimated drive time': 'अनुमानित यात्रा समय',
    'Open navigation in Google Maps': 'Google Maps में नेविगेशन खोलें',
    'Route estimates depend on available road data and may differ from live traffic navigation.': 'मार्ग का अनुमान उपलब्ध सड़क डेटा पर आधारित है और लाइव ट्रैफिक से अलग हो सकता है।',
    'Routing service': 'रूटिंग सेवा',
    'OpenRouteService · shortest / fastest road routing': 'OpenRouteService · सबसे छोटा / तेज़ सड़क मार्ग',
    'The marker shows the DIGIPIN cell centre, not necessarily a building entrance. Map tiles © OpenStreetMap contributors.': 'मार्कर DIGIPIN सेल का केंद्र दिखाता है, ज़रूरी नहीं कि भवन का प्रवेश द्वार हो। मैप टाइल्स © OpenStreetMap contributors.',
    'DIGIPIN location': 'DIGIPIN स्थान',
    'Coordinates only': 'केवल निर्देशांक',
    'Route origin': 'शुरुआती स्थान',
    'Route destination': 'गंतव्य स्थान',
    'Enter two valid 10-character DIGIPINs.': 'दो मान्य 10-अक्षरों वाले DIGIPIN दर्ज करें।',
    'Could not calculate this route. Please try again.': 'मार्ग नहीं निकाला जा सका। कृपया फिर प्रयास करें।',
    'Interactive DIGIPIN map': 'इंटरैक्टिव DIGIPIN मैप'
  },
  ta: {
    'Share on WhatsApp': 'WhatsApp-ல் பகிரவும்',
    'I’m sharing my DIGIPIN digital address:': 'எனது DIGIPIN டிஜிட்டல் முகவரியைப் பகிர்கிறேன்:',
    'Explore DIGIPIN Explorer:': 'DIGIPIN Explorer-ஐப் பாருங்கள்:',
    'Choose language': 'மொழியைத் தேர்ந்தெடுக்கவும்',
    'Current language': 'தற்போதைய மொழி',
    'EXPLORE THE MAP': 'வரைபடத்தை ஆராயுங்கள்',
    'Map your DIGIPIN': 'உங்கள் DIGIPIN-ஐ வரைபடத்தில் காண்க',
    'See a DIGIPIN cell on the map and plan a road route between two digital addresses.': 'வரைபடத்தில் DIGIPIN கலத்தைப் பார்த்து, இரண்டு டிஜிட்டல் முகவரிகளுக்கு இடையிலான சாலை வழியைத் திட்டமிடுங்கள்.',
    'Interactive map': 'ஊடாடும் வரைபடம்',
    'DIGIPIN cell': 'DIGIPIN செல்',
    'Road route': 'சாலை வழி',
    'DIGIPIN ROUTE PLANNER': 'DIGIPIN வழித்தட திட்டமிடல்',
    'Find a road route': 'சாலை வழியைக் கண்டறியவும்',
    'Enter the starting and destination DIGIPIN. We will decode both and draw a route on the map.': 'தொடக்க மற்றும் இலக்கு DIGIPIN-களை உள்ளிடுங்கள். இரண்டையும் decode செய்து வரைபடத்தில் வழியைக் காட்டுவோம்.',
    'Starting DIGIPIN': 'தொடக்க DIGIPIN',
    'Destination DIGIPIN': 'இலக்கு DIGIPIN',
    'Route preference': 'வழி விருப்பம்',
    'Shortest distance': 'குறைந்த தூரம்',
    'Fastest route': 'வேகமான வழி',
    'Calculating route…': 'வழி கணக்கிடப்படுகிறது…',
    'Show route on map': 'வரைபடத்தில் வழியைக் காட்டு',
    'Route found': 'வழி கிடைத்தது',
    'Road distance': 'சாலை தூரம்',
    'Estimated drive time': 'மதிப்பிடப்பட்ட பயண நேரம்',
    'Open navigation in Google Maps': 'Google Maps வழிசெலுத்தலைத் திறக்கவும்',
    'Route estimates depend on available road data and may differ from live traffic navigation.': 'வழி மதிப்பீடு கிடைக்கும் சாலைத் தரவைப் பொறுத்தது; நேரடி போக்குவரத்திலிருந்து மாறுபடலாம்.',
    'Routing service': 'வழித்தட சேவை',
    'OpenRouteService · shortest / fastest road routing': 'OpenRouteService · குறைந்த தூரம் / வேகமான சாலை வழி',
    'The marker shows the DIGIPIN cell centre, not necessarily a building entrance. Map tiles © OpenStreetMap contributors.': 'குறியீடு DIGIPIN கலத்தின் மையத்தைக் காட்டும்; கட்டிட நுழைவாயிலாக இருக்க வேண்டியதில்லை. வரைபட ஓடுகள் © OpenStreetMap contributors.',
    'DIGIPIN location': 'DIGIPIN இடம்',
    'Coordinates only': 'ஆயத்தொலைவுகள் மட்டும்',
    'Route origin': 'தொடக்க இடம்',
    'Route destination': 'இலக்கு இடம்',
    'Enter two valid 10-character DIGIPINs.': 'சரியான 10 எழுத்து DIGIPIN-களை இரண்டையும் உள்ளிடவும்.',
    'Could not calculate this route. Please try again.': 'வழியைக் கணக்கிட முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    'Interactive DIGIPIN map': 'ஊடாடும் DIGIPIN வரைபடம்'
  },
  te: {
    'Share on WhatsApp': 'WhatsAppలో షేర్ చేయండి',
    'I’m sharing my DIGIPIN digital address:': 'నా DIGIPIN డిజిటల్ చిరునామాను మీతో పంచుకుంటున్నాను:',
    'Explore DIGIPIN Explorer:': 'DIGIPIN Explorer చూడండి:',
    'Choose language': 'భాషను ఎంచుకోండి',
    'Current language': 'ప్రస్తుత భాష',
    'EXPLORE THE MAP': 'మ్యాప్\u200cను అన్వేషించండి',
    'Map your DIGIPIN': 'మీ DIGIPIN\u200cను మ్యాప్\u200cలో చూడండి',
    'See a DIGIPIN cell on the map and plan a road route between two digital addresses.': 'మ్యాప్\u200cలో DIGIPIN సెల్\u200cను చూసి రెండు డిజిటల్ చిరునామాల మధ్య రహదారి మార్గాన్ని ప్లాన్ చేయండి.',
    'Interactive map': 'ఇంటరాక్టివ్ మ్యాప్',
    'DIGIPIN cell': 'DIGIPIN సెల్',
    'Road route': 'రోడ్డు మార్గం',
    'DIGIPIN ROUTE PLANNER': 'DIGIPIN మార్గ ప్లానర్',
    'Find a road route': 'రోడ్డు మార్గాన్ని కనుగొనండి',
    'Enter the starting and destination DIGIPIN. We will decode both and draw a route on the map.': 'ప్రారంభ మరియు గమ్య DIGIPINలను నమోదు చేయండి. రెండింటినీ డీకోడ్ చేసి మ్యాప్\u200cలో మార్గాన్ని చూపిస్తాము.',
    'Starting DIGIPIN': 'ప్రారంభ DIGIPIN',
    'Destination DIGIPIN': 'గమ్య DIGIPIN',
    'Route preference': 'మార్గ ప్రాధాన్యత',
    'Shortest distance': 'అతి తక్కువ దూరం',
    'Fastest route': 'వేగవంతమైన మార్గం',
    'Calculating route…': 'మార్గాన్ని లెక్కిస్తోంది…',
    'Show route on map': 'మ్యాప్\u200cలో మార్గాన్ని చూపించు',
    'Route found': 'మార్గం కనుగొనబడింది',
    'Road distance': 'రోడ్డు దూరం',
    'Estimated drive time': 'అంచనా ప్రయాణ సమయం',
    'Open navigation in Google Maps': 'Google Maps నావిగేషన్ తెరవండి',
    'Route estimates depend on available road data and may differ from live traffic navigation.': 'మార్గ అంచనాలు అందుబాటులో ఉన్న రహదారి డేటాపై ఆధారపడతాయి; ప్రత్యక్ష ట్రాఫిక్\u200cతో మారవచ్చు.',
    'Routing service': 'మార్గ సేవ',
    'OpenRouteService · shortest / fastest road routing': 'OpenRouteService · అతి తక్కువ / వేగవంతమైన రహదారి మార్గం',
    'The marker shows the DIGIPIN cell centre, not necessarily a building entrance. Map tiles © OpenStreetMap contributors.': 'మార్కర్ DIGIPIN సెల్ కేంద్రాన్ని చూపుతుంది; అది భవనం ప్రవేశద్వారం కాకపోవచ్చు. మ్యాప్ టైల్స్ © OpenStreetMap contributors.',
    'DIGIPIN location': 'DIGIPIN స్థానం',
    'Coordinates only': 'కోఆర్డినేట్లు మాత్రమే',
    'Route origin': 'ప్రారంభ స్థానం',
    'Route destination': 'గమ్య స్థానం',
    'Enter two valid 10-character DIGIPINs.': 'చెల్లుబాటు అయ్యే 10 అక్షరాల DIGIPINలను రెండింటినీ నమోదు చేయండి.',
    'Could not calculate this route. Please try again.': 'ఈ మార్గాన్ని లెక్కించలేకపోయాం. మళ్లీ ప్రయత్నించండి.',
    'Interactive DIGIPIN map': 'ఇంటరాక్టివ్ DIGIPIN మ్యాప్'
  },
  mr: {
    "Share on WhatsApp": "WhatsApp वर शेअर करा",
    "I’m sharing my DIGIPIN digital address:": "मी माझा DIGIPIN डिजिटल पत्ता शेअर करत आहे:",
    "Explore DIGIPIN Explorer:": "DIGIPIN Explorer पाहा:",
    "Choose language": "भाषा निवडा",
    "Current language": "सध्याची भाषा",
    'EXPLORE THE MAP': 'नकाशा पाहा',
    'Map your DIGIPIN': 'तुमचा DIGIPIN नकाशावर पाहा',
    'See a DIGIPIN cell on the map and plan a road route between two digital addresses.': 'नकाशावर DIGIPIN सेल पाहा आणि दोन डिजिटल पत्त्यांमधील रस्त्याचा मार्ग शोधा.',
    'Interactive map': 'परस्परसंवादी नकाशा',
    'DIGIPIN cell': 'DIGIPIN सेल',
    'Road route': 'रस्त्याचा मार्ग',
    'DIGIPIN ROUTE PLANNER': 'DIGIPIN मार्ग नियोजक',
    'Find a road route': 'रस्त्याचा मार्ग शोधा',
    'Enter the starting and destination DIGIPIN. We will decode both and draw a route on the map.': 'सुरुवातीचा आणि गंतव्य DIGIPIN भरा. आम्ही दोन्ही डिकोड करून नकाशावर मार्ग दाखवू.',
    'Starting DIGIPIN': 'सुरुवातीचा DIGIPIN',
    'Destination DIGIPIN': 'गंतव्य DIGIPIN',
    'Route preference': 'मार्गाचा प्रकार',
    'Shortest distance': 'सर्वात कमी अंतर',
    'Fastest route': 'सर्वात जलद मार्ग',
    'Calculating route…': 'मार्ग मोजत आहे…',
    'Show route on map': 'नकाशावर मार्ग दाखवा',
    'Route found': 'मार्ग सापडला',
    'Road distance': 'रस्त्याचे अंतर',
    'Estimated drive time': 'अंदाजे प्रवास वेळ',
    'Open navigation in Google Maps': 'Google Maps मध्ये नेव्हिगेशन उघडा',
    'Route estimates depend on available road data and may differ from live traffic navigation.': 'मार्गाचा अंदाज उपलब्ध रस्त्यांच्या डेटावर आधारित आहे आणि प्रत्यक्ष वाहतुकीनुसार बदलू शकतो.',
    'Routing service': 'मार्ग सेवा',
    'OpenRouteService · shortest / fastest road routing': 'OpenRouteService · सर्वात कमी / जलद रस्त्याचा मार्ग',
    'The marker shows the DIGIPIN cell centre, not necessarily a building entrance. Map tiles © OpenStreetMap contributors.': 'मार्कर DIGIPIN सेलचा मध्यबिंदू दाखवतो; तो इमारतीचे प्रवेशद्वार असेलच असे नाही. नकाशा टाइल्स © OpenStreetMap contributors.',
    'DIGIPIN location': 'DIGIPIN स्थान',
    'Coordinates only': 'फक्त निर्देशांक',
    'Route origin': 'प्रारंभ स्थान',
    'Route destination': 'गंतव्य स्थान',
    'Enter two valid 10-character DIGIPINs.': 'दोन वैध 10-अक्षरी DIGIPIN भरा.',
    'Could not calculate this route. Please try again.': 'मार्ग मोजता आला नाही. कृपया पुन्हा प्रयत्न करा.',
    'Interactive DIGIPIN map': 'परस्परसंवादी DIGIPIN नकाशा'
  }
};

const languageOptions = [
  { value: 'en', label: 'English', native: 'English' },
  { value: 'hi', label: 'हिन्दी', native: 'Hindi' },
  { value: 'ta', label: 'தமிழ்', native: 'Tamil' },
  { value: 'te', label: 'తెలుగు', native: 'Telugu' },
  { value: 'mr', label: 'मराठी', native: 'Marathi' }
];

function App() {
  const [language, setLanguage] = useState(() => { try { return localStorage.getItem('digipin-language') || 'en'; } catch { return 'en'; } });
  const t = (text) => extraTranslations[language]?.[text] || translations[language]?.[text] || text;
  const changeLanguage = (next) => { setLanguage(next); try { localStorage.setItem('digipin-language', next); } catch {} };
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  useEffect(() => {
    const closeOnOutside = (event) => { if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) setLanguageOpen(false); };
    const closeOnEscape = (event) => { if (event.key === 'Escape') setLanguageOpen(false); };
    document.addEventListener('pointerdown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => { document.removeEventListener('pointerdown', closeOnOutside); document.removeEventListener('keydown', closeOnEscape); };
  }, []);
  const [showIntro, setShowIntro] = useState(true);
  const [mode, setMode] = useState('encode');
  const [lat, setLat] = useState('28.6139');
  const [lon, setLon] = useState('77.2090');
  const [pin, setPin] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageMenuRef = useRef(null);

  useEffect(() => {
    const introTimer = window.setTimeout(() => setShowIntro(false), 3100);
    return () => window.clearTimeout(introTimer);
  }, []);

  const reset = (next) => { setMode(next); setResult(null); setError(''); setCopied(false); };
  async function submit(e) {
    e?.preventDefault(); setError(''); setResult(null); setBusy(true);
    try {
      const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
      const endpoint = mode === 'encode' ? `${apiBase}/api/digipin/encode` : `${apiBase}/api/digipin/decode`;
      const payload = mode === 'encode' ? { latitude: Number(lat), longitude: Number(lon) } : { digipin: pin.trim().toUpperCase() };
      const response = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const body = await response.text();
        throw new Error(t('DIGIPIN API did not return JSON. Check that both services are running with `npm run dev`. Expected API server on port 5001. ') + (body.trim().slice(0, 90) || t('Empty response')));
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t('Something went wrong. Please try again.'));
      setResult(data);
    } catch (err) { setError(err.message || 'Could not reach the DIGIPIN service.'); }
    finally { setBusy(false); }
  }
  function locate() {
    setError('');
    setLocationMessage('');
    if (!navigator.geolocation) { setError(t('Your browser does not support location.')); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      p => {
        setLat(p.coords.latitude.toFixed(6));
        setLon(p.coords.longitude.toFixed(6));
        setLocating(false);
        setLocationMessage(t('Your location is ready'));
        window.setTimeout(() => setLocationMessage(''), 2600);
      },
      err => {
        setLocating(false);
        setError(err.code === 1 ? t('Location access was denied. Allow location permission and try again.') : t('Could not detect your location. Check your device location and try again.'));
      },
      { enableHighAccuracy:true, timeout:15000, maximumAge:30000 }
    );
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),1600); }
    catch { setError(t('Clipboard access is unavailable. Please copy the text manually.')); }
  }
  function shareOnWhatsApp() {
    if (!result) return;
    const sharePin = mode === 'encode' ? result.digipin : pin.trim().toUpperCase();
    const shareLat = mode === 'encode' ? Number(lat).toFixed(6) : Number(result.latitude).toFixed(6);
    const shareLon = mode === 'encode' ? Number(lon).toFixed(6) : Number(result.longitude).toFixed(6);
    const message = `${t('I’m sharing my DIGIPIN digital address:')}\n\nDIGIPIN: ${sharePin}\n${t('COORDINATES')}: ${shareLat}, ${shareLon}\n\n${t('Explore DIGIPIN Explorer:')} ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }
  const coords = result && result.latitude ? `${result.latitude}, ${result.longitude}` : '';
  const mapPoint = result ? (mode === 'encode' ? { latitude: Number(lat), longitude: Number(lon) } : { latitude: Number(result.latitude), longitude: Number(result.longitude) }) : null;
  const mapPin = result ? (mode === 'encode' ? result.digipin : pin.trim().toUpperCase()) : '';
  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  return (
    <div className="app-shell">
      {showIntro && (
        <div
          className="india-post-intro"
          role="status"
          aria-label={t("DIGIPIN Explorer home")}
        >
          <div className="intro-glow intro-glow-one"></div>
          <div className="intro-glow intro-glow-two"></div>
          <div className="intro-content">
            <div className="intro-emblem">
              <img src="/indiapost-logo.webp" alt="India Post — भारतीय डाक" />
            </div>
            <div className="intro-rule">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="intro-kicker">
              {t("DEPARTMENT OF POSTS · GOVERNMENT OF INDIA")}
            </div>
            <h1 className="intro-title">
              {t("A new address for")} <span>{t("Digital India.")}</span>
            </h1>
            <div className="intro-digipin">
              <span className="intro-pin-icon">
                <MapPin size={17} />
              </span>
              <span>DIGIPIN</span>
              <i></i>
              <b>EXPLORER</b>
            </div>
            <p className="intro-tagline">{t("Dak Sewa · Jan Sewa")}</p>
          </div>
          <div className="intro-bottom">
            <span></span>
            <small>{t("CONNECTING EVERY CORNER OF INDIA")}</small>
            <span></span>
          </div>
        </div>
      )}
      <div className="announcement">
        <span className="flag-dot"></span>{" "}
        {t(
          "A digital addressing initiative inspired by India’s geospatial future",
        )}{" "}
        <ArrowUpRight size={13} />
      </div>
      <header className="header">
        <a className="brand" href="#" aria-label="DIGIPIN Explorer home">
          <div className="brand-mark">
            <ScanLine size={25} />
          </div>
          <div>
            <div className="brand-name">
              DIGIPIN<span>EXPLORER</span>
            </div>
            <div className="brand-sub">{t("A location, made precise.")}</div>
          </div>
        </a>
        <nav className={mobileOpen ? "nav nav-open" : "nav"}>
          <a href="#explore" onClick={() => setMobileOpen(false)}>
            {t("Explore")}
          </a>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)}>
            {t("How it works")}
          </a>
          <a href="#about" onClick={() => setMobileOpen(false)}>
            {t("About DIGIPIN")}
          </a>
          <a
            className="nav-source"
            href="https://github.com/INDIAPOST-gov/digipin"
            target="_blank"
            rel="noreferrer"
          >
            {t("Official source")} <ExternalLink size={14} />
          </a>
        </nav>
        <div className="language-menu-wrap" ref={languageMenuRef}>
          <button
            type="button"
            className="language-control"
            onClick={() => setLanguageOpen((open) => !open)}
            aria-label={t("Choose language")}
            aria-expanded={languageOpen}
            aria-haspopup="menu"
          >
            <Languages className="language-globe" size={16} />
            <span className="language-current">
              {languageOptions.find((option) => option.value === language)
                ?.label || "English"}
            </span>
            <ChevronDown
              className={
                languageOpen ? "language-chevron is-open" : "language-chevron"
              }
              size={14}
            />
          </button>
          {languageOpen && (
            <div
              className="language-dropdown"
              role="menu"
              aria-label={t("Choose language")}
            >
              <div className="language-dropdown-heading">
                {t("Choose language")}
              </div>
              {languageOptions.map((option) => (
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={language === option.value}
                  key={option.value}
                  className={`language-option ${language === option.value ? "selected" : ""}`}
                  onClick={() => {
                    changeLanguage(option.value);
                    setLanguageOpen(false);
                  }}
                >
                  <span className="language-option-copy">
                    <strong>{option.label}</strong>
                    <small>{option.native}</small>
                  </span>
                  {language === option.value && <Check size={16} />}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={t("Toggle navigation")}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-icon">
                <Compass size={14} />
              </span>{" "}
              {t("THE NEW LANGUAGE OF LOCATION")}
            </div>
            <h1>
              {t("Every place has a story.")}
              <br />
              <span>{t("Give it an address.")}</span>
            </h1>
            <p className="hero-description">
              {t(
                "Turn coordinates into a precise digital address. Explore India’s geospatial grid with DIGIPIN — built to make every location easier to identify and share.",
              )}
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#explore">
                {t("Find your DIGIPIN")} <ArrowRightLeft size={17} />
              </a>
              <a className="text-link" href="#how-it-works">
                {t("Discover how it works")} <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="trust-row">
              <div className="trust-icon">
                <ShieldCheck size={17} />
              </div>
              <span>{t("Open-source technology")}</span>
              <i></i>
              <span>{t("10-character location code")}</span>
            </div>
          </div>
          <div
            className="hero-art"
            aria-label={t("Illustration of a digital location grid")}
          >
            <div className="art-orbit orbit-one"></div>
            <div className="art-orbit orbit-two"></div>
            <div className="map-grid">
              {Array.from({ length: 81 }, (_, i) => (
                <div
                  key={i}
                  className={`grid-cell ${[13, 14, 22, 23, 24, 31, 32, 33, 40, 41, 42, 49, 50, 58].includes(i) ? "cell-lit" : ""} ${[31, 32, 40, 41, 42, 49, 50].includes(i) ? "cell-hot" : ""}`}
                ></div>
              ))}
            </div>
            <div className="pin-bubble">
              <MapPin size={23} fill="currentColor" />
            </div>
            <div className="coordinate-chip">
              <span className="live-dot"></span>
              <div>
                <small>{t("LOCATION FOUND")}</small>
                <b>28.6139° N, 77.2090° E</b>
              </div>
            </div>
            <div className="code-chip">
              <div className="code-icon">
                <ScanLine size={18} />
              </div>
              <div>
                <small>{t("YOUR DIGITAL ADDRESS")}</small>
                <b>
                  DIGIPIN <span>{t("PREVIEW")}</span>
                </b>
              </div>
              <div className="code-bars">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="art-label label-top">{t("INDIA · GRID 01")}</div>
            <div className="art-label label-bottom">
              {t("PRECISION IN EVERY POINT")}
            </div>
          </div>
        </section>

        <section className="explorer-section" id="explore">
          <div className="section-heading">
            <div>
              <div className="eyebrow">{t("YOUR LOCATION, DECODED")}</div>
              <h2>{t("Explore DIGIPIN")}</h2>
              <p>
                {t(
                  "Generate a code from coordinates, or decode a code to find its location.",
                )}
              </p>
            </div>
            <div className="section-stamp">
              <Sparkles size={16} /> {t("Simple. Precise. Shareable.")}
            </div>
          </div>
          <div className="workspace">
            <div className="form-panel">
              <div className="tabs">
                <button
                  className={mode === "encode" ? "tab active" : "tab"}
                  onClick={() => reset("encode")}
                >
                  <MapPin size={16} /> {t("Generate DIGIPIN")}
                </button>
                <button
                  className={mode === "decode" ? "tab active" : "tab"}
                  onClick={() => reset("decode")}
                >
                  <ScanLine size={16} /> {t("Decode a code")}
                </button>
              </div>
              <form onSubmit={submit}>
                {mode === "encode" ? (
                  <>
                    <div className="field-heading">
                      <span className="step-number">01</span>
                      <div>
                        <b>{t("Enter coordinates")}</b>
                        <small>{t("Use a latitude and longitude pair.")}</small>
                      </div>
                      <button
                        type="button"
                        className={`locate-button ${locating ? "locating" : ""} ${locationMessage ? "located" : ""}`}
                        onClick={locate}
                        disabled={locating}
                      >
                        <span className="locate-icon-wrap">
                          {locating ? (
                            <span className="location-spinner" />
                          ) : locationMessage ? (
                            <Check size={15} />
                          ) : (
                            <LocateFixed size={15} />
                          )}
                        </span>
                        {locating
                          ? t("Finding you…")
                          : locationMessage || t("Use my location")}
                      </button>
                    </div>
                    <div className="input-grid">
                      <label>
                        {t("Latitude")} <span>° N / S</span>
                        <input
                          inputMode="decimal"
                          value={lat}
                          onChange={(e) => setLat(e.target.value)}
                          placeholder={t("e.g. 28.6139")}
                          required
                        />
                      </label>
                      <label>
                        {t("Longitude")} <span>° E / W</span>
                        <input
                          inputMode="decimal"
                          value={lon}
                          onChange={(e) => setLon(e.target.value)}
                          placeholder={t("e.g. 77.2090")}
                          required
                        />
                      </label>
                    </div>
                    <div className="input-hint">
                      <span className="hint-dot"></span>{" "}
                      {t(
                        "India grid coverage: approximately 2.5°–38.5° N and 63.5°–99.5° E.",
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="field-heading">
                      <span className="step-number">01</span>
                      <div>
                        <b>{t("Enter a DIGIPIN code")}</b>
                        <small>
                          {t("Use the continuous 10-character code.")}
                        </small>
                      </div>
                    </div>
                    <label className="full-label">
                      DIGIPIN <span>{t("10 characters")}</span>
                      <input
                        className="pin-input"
                        value={pin}
                        onChange={(e) =>
                          setPin(
                            e.target.value
                              .toUpperCase()
                              .replace(/[^23456789CJKLMPFT]/g, ""),
                          )
                        }
                        placeholder={t("e.g. 4T396F42L7")}
                        maxLength={10}
                        required
                      />
                    </label>
                    <div className="input-hint">
                      <span className="hint-dot"></span>{" "}
                      {t(
                        "Accepted characters: 2–9, C, J, K, L, M, P, F and T.",
                      )}
                    </div>
                  </>
                )}
                {error && (
                  <div className="error-message" role="alert">
                    {error}
                  </div>
                )}
                <button
                  className="button button-submit"
                  type="submit"
                  disabled={busy}
                >
                  {busy
                    ? t("Working…")
                    : mode === "encode"
                      ? t("Generate my DIGIPIN")
                      : t("Find this location")}{" "}
                  <ArrowUpRight size={17} />
                </button>
              </form>
            </div>
            <div className="result-panel">
              {!result ? (
                <div className="empty-result">
                  <div className="result-illustration">
                    <div className="result-ring ring-a"></div>
                    <div className="result-ring ring-b"></div>
                    <div className="result-pin">
                      <MapPin size={28} />
                    </div>
                    <span className="spark spark-a">✳</span>
                    <span className="spark spark-b">✦</span>
                  </div>
                  <div className="result-kicker">
                    {t("YOUR RESULT WILL APPEAR HERE")}
                  </div>
                  <h3>{t("Ready when you are.")}</h3>
                  <p>
                    {t(
                      "Enter your details and we’ll translate your location into a digital address.",
                    )}
                  </p>
                  <div className="result-footer">
                    <span>
                      <ShieldCheck size={14} />{" "}
                      {t("Processed using the official open-source algorithm")}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="success-result">
                  <div className="success-top">
                    <span className="success-badge">
                      <Check size={14} /> {t("SUCCESS")}
                    </span>
                    <span className="result-kicker">
                      {t("YOUR LOCATION IS READY")}
                    </span>
                  </div>
                  {mode === "encode" ? (
                    <>
                      <div className="result-kicker result-title">
                        {t("YOUR DIGIPIN")}
                      </div>
                      <div className="generated-pin">{result.digipin}</div>
                      <p className="result-explain">
                        {t(
                          "Your 10-character digital location code is ready to copy and share.",
                        )}
                      </p>
                      <div className="result-actions">
                        <button
                          className="button copy-button"
                          onClick={() => copy(result.digipin)}
                        >
                          <Copy size={16} />
                          {copied ? t("Copied!") : t("Copy DIGIPIN")}
                        </button>
                        <button
                          className="button whatsapp-button"
                          onClick={shareOnWhatsApp}
                        >
                          <MessageCircle size={17} />
                          {t("Share on WhatsApp")}
                        </button>
                      </div>
                      <div className="result-meta">
                        <span>{t("COORDINATES")}</span>
                        <b>
                          {Number(lat).toFixed(6)}, {Number(lon).toFixed(6)}
                        </b>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="result-kicker result-title">
                        {t("LOCATION COORDINATES")}
                      </div>
                      <div className="decoded-coords">
                        {Number(result.latitude).toFixed(6)}
                        <small>{t("LAT")}</small>
                      </div>
                      <div className="decoded-coords">
                        {Number(result.longitude).toFixed(6)}
                        <small>{t("LON")}</small>
                      </div>
                      <p className="result-explain">
                        {t(
                          "These coordinates represent the centre point of the DIGIPIN grid cell.",
                        )}
                      </p>
                      <div className="result-actions">
                        <button
                          className="button copy-button"
                          onClick={() => copy(coords)}
                        >
                          <Copy size={16} />
                          {copied ? t("Copied!") : t("Copy coordinates")}
                        </button>
                        <button
                          className="button whatsapp-button"
                          onClick={shareOnWhatsApp}
                        >
                          <MessageCircle size={17} />
                          {t("Share on WhatsApp")}
                        </button>
                      </div>
                      <a
                        className="map-link"
                        href={`https://www.google.com/maps?q=${result.latitude},${result.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Navigation size={15} /> {t("Open in Google Maps")}{" "}
                        <ArrowUpRight size={14} />
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <MapExplorer
          t={t}
          apiBase={apiBase}
          point={mapPoint}
          pin={mapPin}
          language={language}
        />

        <section className="steps-section" id="how-it-works">
          <div className="eyebrow">{t("A SMALL CODE. A BIG POSSIBILITY.")}</div>
          <h2>
            {t("Location, simplified in")} <span>{t("three steps.")}</span>
          </h2>
          <div className="steps-grid">
            <article className="step-card">
              <div className="step-visual visual-one">
                <MapPin size={26} />
                <span className="mini-coord">28.6139° N</span>
              </div>
              <span className="step-label">{t("STEP 01")}</span>
              <h3>{t("Choose a place")}</h3>
              <p>
                {t(
                  "Start with coordinates or use your device’s current location.",
                )}
              </p>
            </article>
            <article className="step-card">
              <div className="step-visual visual-two">
                <ScanLine size={27} />
                <div className="mini-code">4T3 · 96F · 42L7</div>
              </div>
              <span className="step-label">{t("STEP 02")}</span>
              <h3>{t("Generate a DIGIPIN")}</h3>
              <p>
                {t(
                  "The official open-source algorithm maps the point into a compact code.",
                )}
              </p>
            </article>
            <article className="step-card">
              <div className="step-visual visual-three">
                <Navigation size={25} />
                <div className="mini-map-dot"></div>
                <div className="mini-route"></div>
              </div>
              <span className="step-label">{t("STEP 03")}</span>
              <h3>{t("Share with confidence")}</h3>
              <p>
                {t(
                  "Copy your code or decode an existing DIGIPIN into coordinates.",
                )}
              </p>
            </article>
          </div>
        </section>

        <section className="about-banner" id="about">
          <div className="about-emblem">
            <ScanLine size={30} />
          </div>
          <div className="about-copy">
            <div className="eyebrow">{t("BUILT ON OPEN SOURCE")}</div>
            <h2>{t("Designed for a more connected India.")}</h2>
            <p>
              {t(
                "DIGIPIN is a geospatial addressing grid initiative by the Department of Posts, Government of India. This independent explorer uses the published open-source implementation to make its encoding and decoding functions easier to try.",
              )}
            </p>
            <a
              href="https://github.com/INDIAPOST-gov/digipin"
              target="_blank"
              rel="noreferrer"
              className="about-link"
            >
              {t("Explore the official repository")} <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="about-orbit"></div>
        </section>
        {/* DIGIPIN technology and collaboration section */}
        <DigipinTechnology />
      </main>
      <footer className="footer">
        <a className="footer-brand" href="#">
          <span className="brand-mark small">
            <ScanLine size={17} />
          </span>
          <b>{t("DIGIPIN EXPLORER")}</b>
        </a>
        <span>
          {t(
            "Independent community interface · Not an official India Post website",
          )}
        </span>
        <a
          href="https://github.com/INDIAPOST-gov/digipin"
          target="_blank"
          rel="noreferrer"
        >
          <Github size={15} /> {t("Open-source foundation")}
        </a>
      </footer>
    </div>
  );
}
createRoot(document.getElementById('root')).render(<App />);