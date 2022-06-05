import { UploadedFile } from 'express-fileupload';
import { Payload } from '../../..';
import { PayloadRequest } from '../../../express/types';
import { Document } from '../../../types';
import getFileByPath from '../../../uploads/getFileByPath';
import create from '../create';

export type Options<T> = {
  collection: string
  data: Record<string, unknown>
  depth?: number
  locale?: string
  fallbackLocale?: string
  user?: Document
  overrideAccess?: boolean
  disableVerificationEmail?: boolean
  showHiddenFields?: boolean
  filePath?: string
  overwriteExistingFiles?: boolean
  req?: PayloadRequest
  draft?: boolean
}

export default async function createLocal<T = any>(payload: Payload, options: Options<T>): Promise<T> {
  const {
    collection: collectionSlug,
    depth,
    locale = payload?.config?.localization?.defaultLocale,
    fallbackLocale = null,
    data,
    user,
    overrideAccess = true,
    disableVerificationEmail,
    showHiddenFields,
    filePath,
    overwriteExistingFiles = false,
    req,
    draft,
  } = options;

  const collection = payload.collections[collectionSlug];

  return create({
    depth,
    data,
    collection,
    overrideAccess,
    disableVerificationEmail,
    showHiddenFields,
    overwriteExistingFiles,
    draft,
    req: {
      ...req,
      user,
      payloadAPI: 'local',
      locale,
      fallbackLocale,
      payload,
      files: {
        file: getFileByPath(filePath) as UploadedFile,
      },
    } as PayloadRequest,
  });
}
