package com.rgpay.pos.data.device

import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel

class DeviceMetadataModel : ViewModel() {
    var serialId by mutableStateOf("")
        private set

    val serialIdHasError by derivedStateOf {
        serialId.isNotEmpty()
    }

    fun updateSerialId(serialId: String) {
        this.serialId = serialId
    }

    var deviceName by mutableStateOf("")
        private set

    /**
     * deviceName is optional
     */
    val deviceNameHasError by derivedStateOf {
        true
    }

    fun updateDeviceName(deviceName: String) {
        this.deviceName = deviceName
    }

    var provider by mutableStateOf("")
        private set

    val providerHasError by derivedStateOf {
        provider.isNotEmpty()
    }

    fun updateProvider(provider: String) {
        this.provider = provider
    }
}
