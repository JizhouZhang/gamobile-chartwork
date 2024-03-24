export const decodeNdefRecord = (record: any): string => {
  if (record.type === 'T') {
    const textDecoder = new TextDecoder();
    return textDecoder.decode(record.payload);
  }
  return 'Non-text record found';
};
