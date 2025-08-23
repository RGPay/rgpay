package com.rgpay.pos.data.device

import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel

class DeviceMetadataModel : ViewModel() {
    companion object {
        const val MAX_SERIAL_LENGTH = 20
        const val MAX_DEVICE_NAME_LENGTH = 50
        private val SERIAL_REGEX = Regex("^[a-zA-Z0-9_-]*$")
    }

    var serialId by mutableStateOf("")
        private set

    val serialIdHasError by derivedStateOf {
        serialId.isBlank() || serialId.length > MAX_SERIAL_LENGTH || !SERIAL_REGEX.matches(serialId)
    }

    fun updateSerialId(input: String) {
        // Remove caracteres inválidos e limita tamanho
        val cleaned =
            input.filter { it.isLetterOrDigit() || it == '_' || it == '-' }.take(MAX_SERIAL_LENGTH)
        serialId = cleaned
    }

    var deviceName by mutableStateOf("")
        private set

    val deviceNameHasError by derivedStateOf {
        deviceName.length > MAX_DEVICE_NAME_LENGTH || deviceName.contains("\n")
    }

    fun updateDeviceName(input: String) {
        // Remove quebras de linha e limita tamanho
        val cleaned = input.replace("\n", "").take(MAX_DEVICE_NAME_LENGTH)
        deviceName = cleaned
    }
}
