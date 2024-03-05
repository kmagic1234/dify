import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import { useContext } from 'use-context-selector'
import { useFeatures } from '../../hooks'
import { FileSearch02 } from '@/app/components/base/icons/src/vender/solid/files'
import { Settings01 } from '@/app/components/base/icons/src/vender/line/general'
import { useModalContext } from '@/context/modal-context'
import { fetchCodeBasedExtensionList } from '@/service/common'
import I18n from '@/context/i18n'

const Moderation = () => {
  const { t } = useTranslation()
  const { setShowModerationSettingModal } = useModalContext()
  const { locale } = useContext(I18n)
  const moderation = useFeatures(s => s.moderation)
  const setModeration = useFeatures(s => s.setModeration)

  const { data: codeBasedExtensionList } = useSWR(
    '/code-based-extension?module=moderation',
    fetchCodeBasedExtensionList,
  )

  const handleOpenModerationSettingModal = () => {
    setShowModerationSettingModal({
      payload: moderation,
      onSaveCallback: setModeration,
    })
  }

  const renderInfo = () => {
    let prefix = ''
    let suffix = ''
    if (moderation.type === 'openai_moderation')
      prefix = t('appDebug.feature.moderation.modal.provider.openai')
    else if (moderation.type === 'keywords')
      prefix = t('appDebug.feature.moderation.modal.provider.keywords')
    else if (moderation.type === 'api')
      prefix = t('common.apiBasedExtension.selector.title')
    else
      prefix = codeBasedExtensionList?.data.find(item => item.name === moderation.type)?.label[locale] || ''

    if (moderation.config?.inputs_config?.enabled && moderation.config?.outputs_config?.enabled)
      suffix = t('appDebug.feature.moderation.allEnabled')
    else if (moderation.config?.inputs_config?.enabled)
      suffix = t('appDebug.feature.moderation.inputEnabled')
    else if (moderation.config?.outputs_config?.enabled)
      suffix = t('appDebug.feature.moderation.outputEnabled')

    return `${prefix} · ${suffix}`
  }

  return (
    <div className='flex items-center px-3 h-12 bg-gray-50 rounded-xl overflow-hidden'>
      <div className='shrink-0 flex items-center justify-center mr-1 w-6 h-6'>
        <FileSearch02 className='shrink-0 w-4 h-4 text-[#039855]' />
      </div>
      <div className='shrink-0 mr-2 whitespace-nowrap text-sm text-gray-800 font-semibold'>
        {t('appDebug.feature.moderation.title')}
      </div>
      <div
        className='grow block w-0 text-right text-xs text-gray-500 truncate'
        title={renderInfo()}>
        {renderInfo()}
      </div>
      <div className='shrink-0 ml-4 mr-1 w-[1px] h-3.5 bg-gray-200'></div>
      <div
        className={`
          shrink-0 flex items-center px-3 h-7 cursor-pointer rounded-md
          text-xs text-gray-700 font-medium hover:bg-gray-200
        `}
        onClick={handleOpenModerationSettingModal}
      >
        <Settings01 className='mr-[5px] w-3.5 h-3.5' />
        {t('common.operation.settings')}
      </div>
    </div>
  )
}

export default memo(Moderation)