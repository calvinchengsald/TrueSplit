import React from 'react'
import {EMAIL_CONFIG} from '../constants/EmailConfig';
// We can use react-native Linking to send email
import qs from 'qs';
import { Linking } from 'react-native';


export async function sendEmail(   options = {}) {
    const { cc, bcc } = options;

    let url = `mailto:${EMAIL_CONFIG.TARGET}`;

    // Create email link query
    const query = qs.stringify({
        subject: EMAIL_CONFIG.SUBJECT,
        body: EMAIL_CONFIG.BODY,
        cc: cc,
        bcc: bcc
    });

    if (query.length) {
        url += `?${query}`;
    }

    // check if we can use this link
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
        throw new Error('Provided URL can not be handled');
    }

    return Linking.openURL(url);
}
