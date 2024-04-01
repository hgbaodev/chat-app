import pdf from '~/assets/pdf_icon.svg';
import word from '~/assets/word_icon.svg';
import excel from '~/assets/excel_icon.svg';
import { MessageTypes } from '~/utils/enum';

export const getIconDocument = (type) => {
  if (type == 'xlsx' || type == 'xls') return excel;
  if (type == 'pdf') return pdf;
  if (type == 'doc' || type == 'docx') return word;
};

export const getContentMessage = (messageObj) => {
  const { message_type, message, attachments } = messageObj;
  switch (message_type) {
    case MessageTypes.TEXT:
      return message;
    case MessageTypes.AUDIO:
      return '[Voice]';
    case MessageTypes.IMAGE:
      return '[Image]';
    case MessageTypes.DOCUMENT:
      return attachments.file_name;
  }
};
