package com.rgpay.pos.client

import com.rgpay.pos.errors.DeviceAlreadyAssignedError
import com.rgpay.pos.errors.DeviceNotAssignedError
import com.rgpay.pos.errors.DeviceNotFoundError
import kotlinx.coroutines.delay

data class DeviceMetadata(
    val deviceName: String,
    var apiKey: String, // chave do gestor
    val locationId: String,
    val locationName: String,
    var assigned: Boolean = false
)

class DeviceApiClient {

    private val devices = mutableListOf(
        DeviceMetadata(apiKey = "senha123", deviceName = "sdk_gphone64_arm64", locationId = "123", locationName = "Bar do Tom")
    )

    // GET /device?apiKey={key}
    suspend fun getDevice(key: String): DeviceMetadata {
        println("Getting device by key: $key")
        delay(2000) // simula rede

        val device = devices.find { it.apiKey == key }
            ?: throw DeviceNotFoundError("Dispositivo não encontrado")

        return device
    }

    // PUT /device/assignments
    suspend fun assignDevice(key: String): DeviceMetadata {
        println("Assigning device by key: $key")
        delay(1500)

        val index = devices.indexOfFirst { it.apiKey == key }
        if (index == -1) throw DeviceNotFoundError("Dispositivo não encontrado")

        val device = devices[index]

        if (device.assigned) throw DeviceAlreadyAssignedError("Dispositivo já está ativo")

        device.assigned = true
        devices[index] = device
        return device
    }

    // POST login
    suspend fun login(key: String): String {
        println("Logging in by key: $key")
        delay(1000)

        val device = devices.find { it.apiKey == key }
            ?: throw DeviceNotFoundError("Dispositivo não encontrado")

        if (!device.assigned) throw DeviceNotAssignedError("Dispositivo não está registrado")

        return "jwt_${device.apiKey}"
    }
}
