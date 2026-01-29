
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)

interface _GlobalComponents {
      'DisplayValue': typeof import("../components/DisplayValue.vue")['default']
    'LabelValueGrid': typeof import("../components/LabelValueGrid.vue")['default']
    'ThemeToggle': typeof import("../components/ThemeToggle.vue")['default']
    'TransactionHash': typeof import("../components/TransactionHash.vue")['default']
    'MultiAgent': typeof import("../components/TransactonFlows/MultiAgent.vue")['default']
    'SingleSigner': typeof import("../components/TransactonFlows/SingleSigner.vue")['default']
    'Sponsor': typeof import("../components/TransactonFlows/Sponsor.vue")['default']
    'TransactionParameters': typeof import("../components/TransactonFlows/TransactionParameters.vue")['default']
    'WalletConnection': typeof import("../components/WalletConnection/WalletConnection.vue")['default']
    'AptosConnectWalletRow': typeof import("../components/WalletSelector/AptosConnectWalletRow.vue")['default']
    'ConnectWalletDialog': typeof import("../components/WalletSelector/ConnectWalletDialog.vue")['default']
    'WalletRow': typeof import("../components/WalletSelector/WalletRow.vue")['default']
    'WalletSelection': typeof import("../components/WalletSelector/WalletSelection.vue")['default']
    'WalletSelector': typeof import("../components/WalletSelector/WalletSelector.vue")['default']
    'WalletIcon': typeof import("../components/ui/Wallet/WalletIcon.vue")['default']
    'WalletLink': typeof import("../components/ui/Wallet/WalletLink.vue")['default']
    'Alert': typeof import("../components/ui/alert/Alert.vue")['default']
    'AlertDescription': typeof import("../components/ui/alert/AlertDescription.vue")['default']
    'AlertTitle': typeof import("../components/ui/alert/AlertTitle.vue")['default']
    'Button': typeof import("../components/ui/button/Button.vue")['default']
    'Card': typeof import("../components/ui/card/Card.vue")['default']
    'CardContent': typeof import("../components/ui/card/CardContent.vue")['default']
    'CardDescription': typeof import("../components/ui/card/CardDescription.vue")['default']
    'CardFooter': typeof import("../components/ui/card/CardFooter.vue")['default']
    'CardHeader': typeof import("../components/ui/card/CardHeader.vue")['default']
    'CardTitle': typeof import("../components/ui/card/CardTitle.vue")['default']
    'Collapsible': typeof import("../components/ui/collapsible/Collapsible.vue")['default']
    'CollapsibleContent': typeof import("../components/ui/collapsible/CollapsibleContent.vue")['default']
    'CollapsibleTrigger': typeof import("../components/ui/collapsible/CollapsibleTrigger.vue")['default']
    'Dialog': typeof import("../components/ui/dialog/Dialog.vue")['default']
    'DialogClose': typeof import("../components/ui/dialog/DialogClose.vue")['default']
    'DialogContent': typeof import("../components/ui/dialog/DialogContent.vue")['default']
    'DialogDescription': typeof import("../components/ui/dialog/DialogDescription.vue")['default']
    'DialogFooter': typeof import("../components/ui/dialog/DialogFooter.vue")['default']
    'DialogHeader': typeof import("../components/ui/dialog/DialogHeader.vue")['default']
    'DialogOverlay': typeof import("../components/ui/dialog/DialogOverlay.vue")['default']
    'DialogScrollContent': typeof import("../components/ui/dialog/DialogScrollContent.vue")['default']
    'DialogTitle': typeof import("../components/ui/dialog/DialogTitle.vue")['default']
    'DialogTrigger': typeof import("../components/ui/dialog/DialogTrigger.vue")['default']
    'DropdownMenu': typeof import("../components/ui/dropdown-menu/DropdownMenu.vue")['default']
    'DropdownMenuCheckboxItem': typeof import("../components/ui/dropdown-menu/DropdownMenuCheckboxItem.vue")['default']
    'DropdownMenuContent': typeof import("../components/ui/dropdown-menu/DropdownMenuContent.vue")['default']
    'DropdownMenuGroup': typeof import("../components/ui/dropdown-menu/DropdownMenuGroup.vue")['default']
    'DropdownMenuItem': typeof import("../components/ui/dropdown-menu/DropdownMenuItem.vue")['default']
    'DropdownMenuLabel': typeof import("../components/ui/dropdown-menu/DropdownMenuLabel.vue")['default']
    'DropdownMenuRadioGroup': typeof import("../components/ui/dropdown-menu/DropdownMenuRadioGroup.vue")['default']
    'DropdownMenuRadioItem': typeof import("../components/ui/dropdown-menu/DropdownMenuRadioItem.vue")['default']
    'DropdownMenuSeparator': typeof import("../components/ui/dropdown-menu/DropdownMenuSeparator.vue")['default']
    'DropdownMenuShortcut': typeof import("../components/ui/dropdown-menu/DropdownMenuShortcut.vue")['default']
    'DropdownMenuSub': typeof import("../components/ui/dropdown-menu/DropdownMenuSub.vue")['default']
    'DropdownMenuSubContent': typeof import("../components/ui/dropdown-menu/DropdownMenuSubContent.vue")['default']
    'DropdownMenuSubTrigger': typeof import("../components/ui/dropdown-menu/DropdownMenuSubTrigger.vue")['default']
    'DropdownMenuTrigger': typeof import("../components/ui/dropdown-menu/DropdownMenuTrigger.vue")['default']
    'Label': typeof import("../components/ui/label/Label.vue")['default']
    'RadioGroup': typeof import("../components/ui/radio-group/RadioGroup.vue")['default']
    'RadioGroupItem': typeof import("../components/ui/radio-group/RadioGroupItem.vue")['default']
    'Switch': typeof import("../components/ui/switch/Switch.vue")['default']
    'Toast': typeof import("../components/ui/toast/Toast.vue")['default']
    'ToastAction': typeof import("../components/ui/toast/ToastAction.vue")['default']
    'ToastClose': typeof import("../components/ui/toast/ToastClose.vue")['default']
    'ToastDescription': typeof import("../components/ui/toast/ToastDescription.vue")['default']
    'ToastProvider': typeof import("../components/ui/toast/ToastProvider.vue")['default']
    'ToastTitle': typeof import("../components/ui/toast/ToastTitle.vue")['default']
    'ToastViewport': typeof import("../components/ui/toast/ToastViewport.vue")['default']
    'Toaster': typeof import("../components/ui/toast/Toaster.vue")['default']
    'NuxtWelcome': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'ColorScheme': typeof import("../../../node_modules/.pnpm/@nuxtjs+color-mode@3.5.2_magicast@0.3.5/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']
    'NuxtPage': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/server-placeholder")['default']
      'LazyDisplayValue': LazyComponent<typeof import("../components/DisplayValue.vue")['default']>
    'LazyLabelValueGrid': LazyComponent<typeof import("../components/LabelValueGrid.vue")['default']>
    'LazyThemeToggle': LazyComponent<typeof import("../components/ThemeToggle.vue")['default']>
    'LazyTransactionHash': LazyComponent<typeof import("../components/TransactionHash.vue")['default']>
    'LazyMultiAgent': LazyComponent<typeof import("../components/TransactonFlows/MultiAgent.vue")['default']>
    'LazySingleSigner': LazyComponent<typeof import("../components/TransactonFlows/SingleSigner.vue")['default']>
    'LazySponsor': LazyComponent<typeof import("../components/TransactonFlows/Sponsor.vue")['default']>
    'LazyTransactionParameters': LazyComponent<typeof import("../components/TransactonFlows/TransactionParameters.vue")['default']>
    'LazyWalletConnection': LazyComponent<typeof import("../components/WalletConnection/WalletConnection.vue")['default']>
    'LazyAptosConnectWalletRow': LazyComponent<typeof import("../components/WalletSelector/AptosConnectWalletRow.vue")['default']>
    'LazyConnectWalletDialog': LazyComponent<typeof import("../components/WalletSelector/ConnectWalletDialog.vue")['default']>
    'LazyWalletRow': LazyComponent<typeof import("../components/WalletSelector/WalletRow.vue")['default']>
    'LazyWalletSelection': LazyComponent<typeof import("../components/WalletSelector/WalletSelection.vue")['default']>
    'LazyWalletSelector': LazyComponent<typeof import("../components/WalletSelector/WalletSelector.vue")['default']>
    'LazyWalletIcon': LazyComponent<typeof import("../components/ui/Wallet/WalletIcon.vue")['default']>
    'LazyWalletLink': LazyComponent<typeof import("../components/ui/Wallet/WalletLink.vue")['default']>
    'LazyAlert': LazyComponent<typeof import("../components/ui/alert/Alert.vue")['default']>
    'LazyAlertDescription': LazyComponent<typeof import("../components/ui/alert/AlertDescription.vue")['default']>
    'LazyAlertTitle': LazyComponent<typeof import("../components/ui/alert/AlertTitle.vue")['default']>
    'LazyButton': LazyComponent<typeof import("../components/ui/button/Button.vue")['default']>
    'LazyCard': LazyComponent<typeof import("../components/ui/card/Card.vue")['default']>
    'LazyCardContent': LazyComponent<typeof import("../components/ui/card/CardContent.vue")['default']>
    'LazyCardDescription': LazyComponent<typeof import("../components/ui/card/CardDescription.vue")['default']>
    'LazyCardFooter': LazyComponent<typeof import("../components/ui/card/CardFooter.vue")['default']>
    'LazyCardHeader': LazyComponent<typeof import("../components/ui/card/CardHeader.vue")['default']>
    'LazyCardTitle': LazyComponent<typeof import("../components/ui/card/CardTitle.vue")['default']>
    'LazyCollapsible': LazyComponent<typeof import("../components/ui/collapsible/Collapsible.vue")['default']>
    'LazyCollapsibleContent': LazyComponent<typeof import("../components/ui/collapsible/CollapsibleContent.vue")['default']>
    'LazyCollapsibleTrigger': LazyComponent<typeof import("../components/ui/collapsible/CollapsibleTrigger.vue")['default']>
    'LazyDialog': LazyComponent<typeof import("../components/ui/dialog/Dialog.vue")['default']>
    'LazyDialogClose': LazyComponent<typeof import("../components/ui/dialog/DialogClose.vue")['default']>
    'LazyDialogContent': LazyComponent<typeof import("../components/ui/dialog/DialogContent.vue")['default']>
    'LazyDialogDescription': LazyComponent<typeof import("../components/ui/dialog/DialogDescription.vue")['default']>
    'LazyDialogFooter': LazyComponent<typeof import("../components/ui/dialog/DialogFooter.vue")['default']>
    'LazyDialogHeader': LazyComponent<typeof import("../components/ui/dialog/DialogHeader.vue")['default']>
    'LazyDialogOverlay': LazyComponent<typeof import("../components/ui/dialog/DialogOverlay.vue")['default']>
    'LazyDialogScrollContent': LazyComponent<typeof import("../components/ui/dialog/DialogScrollContent.vue")['default']>
    'LazyDialogTitle': LazyComponent<typeof import("../components/ui/dialog/DialogTitle.vue")['default']>
    'LazyDialogTrigger': LazyComponent<typeof import("../components/ui/dialog/DialogTrigger.vue")['default']>
    'LazyDropdownMenu': LazyComponent<typeof import("../components/ui/dropdown-menu/DropdownMenu.vue")['default']>
    'LazyDropdownMenuCheckboxItem': LazyComponent<typeof import("../components/ui/dropdown-menu/DropdownMenuCheckboxItem.vue")['default']>
    'LazyDropdownMenuContent': LazyComponent<typeof import("../components/ui/dropdown-menu/DropdownMenuContent.vue")['default']>
    'LazyDropdownMenuGroup': LazyComponent<typeof import("../components/ui/dropdown-menu/DropdownMenuGroup.vue")['default']>
    'LazyDropdownMenuItem': LazyComponent<typeof import("../components/ui/dropdown-menu/DropdownMenuItem.vue")['default']>
    'LazyDropdownMenuLabel': LazyComponent<typeof import("../components/ui/dropdown-menu/DropdownMenuLabel.vue")['default']>
    'LazyDropdownMenuRadioGroup': LazyComponent<typeof import("../components/ui/dropdown-menu/DropdownMenuRadioGroup.vue")['default']>
    'LazyDropdownMenuRadioItem': LazyComponent<typeof import("../components/ui/dropdown-menu/DropdownMenuRadioItem.vue")['default']>
    'LazyDropdownMenuSeparator': LazyComponent<typeof import("../components/ui/dropdown-menu/DropdownMenuSeparator.vue")['default']>
    'LazyDropdownMenuShortcut': LazyComponent<typeof import("../components/ui/dropdown-menu/DropdownMenuShortcut.vue")['default']>
    'LazyDropdownMenuSub': LazyComponent<typeof import("../components/ui/dropdown-menu/DropdownMenuSub.vue")['default']>
    'LazyDropdownMenuSubContent': LazyComponent<typeof import("../components/ui/dropdown-menu/DropdownMenuSubContent.vue")['default']>
    'LazyDropdownMenuSubTrigger': LazyComponent<typeof import("../components/ui/dropdown-menu/DropdownMenuSubTrigger.vue")['default']>
    'LazyDropdownMenuTrigger': LazyComponent<typeof import("../components/ui/dropdown-menu/DropdownMenuTrigger.vue")['default']>
    'LazyLabel': LazyComponent<typeof import("../components/ui/label/Label.vue")['default']>
    'LazyRadioGroup': LazyComponent<typeof import("../components/ui/radio-group/RadioGroup.vue")['default']>
    'LazyRadioGroupItem': LazyComponent<typeof import("../components/ui/radio-group/RadioGroupItem.vue")['default']>
    'LazySwitch': LazyComponent<typeof import("../components/ui/switch/Switch.vue")['default']>
    'LazyToast': LazyComponent<typeof import("../components/ui/toast/Toast.vue")['default']>
    'LazyToastAction': LazyComponent<typeof import("../components/ui/toast/ToastAction.vue")['default']>
    'LazyToastClose': LazyComponent<typeof import("../components/ui/toast/ToastClose.vue")['default']>
    'LazyToastDescription': LazyComponent<typeof import("../components/ui/toast/ToastDescription.vue")['default']>
    'LazyToastProvider': LazyComponent<typeof import("../components/ui/toast/ToastProvider.vue")['default']>
    'LazyToastTitle': LazyComponent<typeof import("../components/ui/toast/ToastTitle.vue")['default']>
    'LazyToastViewport': LazyComponent<typeof import("../components/ui/toast/ToastViewport.vue")['default']>
    'LazyToaster': LazyComponent<typeof import("../components/ui/toast/Toaster.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyColorScheme': LazyComponent<typeof import("../../../node_modules/.pnpm/@nuxtjs+color-mode@3.5.2_magicast@0.3.5/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']>
    'LazyNuxtPage': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../../node_modules/.pnpm/nuxt@3.19.0_@parcel+watcher@2.5.1_@types+node@24.5.2_@vue+compiler-sfc@3.5.21_bufferutil@4.0._x5kyn53r34aerms3vpv2ttbspm/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
