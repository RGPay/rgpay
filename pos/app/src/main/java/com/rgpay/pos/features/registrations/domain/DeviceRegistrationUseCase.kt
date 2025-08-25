package com.rgpay.pos.features.registrations.domain

import com.rgpay.pos.features.registrations.data.DeviceMetadataModel
import com.rgpay.pos.features.registrations.clients.DeviceApiClient
import com.rgpay.pos.features.registrations.clients.DeviceMetadata
import com.rgpay.pos.core.errors.DeviceNotFoundError
import com.rgpay.pos.core.errors.DeviceAlreadyAssignedError
import com.rgpay.pos.core.errors.DeviceNotAssignedError

class DeviceRegistrationUseCase(
    private val deviceApiClient: DeviceApiClient
) {
    
    suspend fun getDevice(apiKey: String): DeviceMetadata {
        return deviceApiClient.getDevice(apiKey)
    }
    
    suspend fun assignDevice(apiKey: String): DeviceMetadata {
        return deviceApiClient.assignDevice(apiKey)
    }
    
    suspend fun login(apiKey: String): String {
        return deviceApiClient.login(apiKey)
    }
    
    fun validateDeviceName(deviceName: String): Boolean {
        return deviceName.isNotBlank() && 
               deviceName.length <= DeviceMetadataModel.MAX_DEVICE_NAME_LENGTH &&
               !deviceName.contains("\n")
    }
    
    fun validateLocationName(locationName: String): Boolean {
        return locationName.isNotBlank() && 
               locationName.length <= DeviceMetadataModel.MAX_DEVICE_NAME_LENGTH &&
               !locationName.contains("\n")
    }
}
