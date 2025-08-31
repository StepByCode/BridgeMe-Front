import {
  Button,
  Card,
  H2,
  H3,
  Paragraph,
  Spinner,
  YStack,
  XStack
} from '@my/ui'
import { useState, useEffect } from 'react'

interface Profile {
  id: string
  name: string
  affiliation: string
  bio: string
  instagram_id: string
  twitter_id: string
  created_at: string
}

export function ProfileList() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfiles = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('https://api.bridgeme.com/profiles')
      
      if (!response.ok) {
        throw new Error('プロフィールの取得に失敗しました')
      }
      
      const data = await response.json()
      setProfiles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  if (loading) {
    return (
      <YStack flex={1} justify="center" items="center" gap="$4">
        <Spinner size="large" />
        <Paragraph>プロフィールを読み込み中...</Paragraph>
      </YStack>
    )
  }

  if (error) {
    return (
      <YStack flex={1} justify="center" items="center" gap="$4" p="$4">
        <Paragraph color="$red10">{error}</Paragraph>
        <Button onPress={fetchProfiles}>再試行</Button>
      </YStack>
    )
  }

  return (
    <YStack flex={1} gap="$4" p="$4">
      <H2 text="center">プロフィール一覧</H2>
      
      {profiles.length === 0 ? (
        <YStack justify="center" items="center" gap="$4">
          <Paragraph>プロフィールがありません</Paragraph>
          <Button onPress={fetchProfiles}>更新</Button>
        </YStack>
      ) : (
        <YStack gap="$3">
          {profiles.map((profile) => (
            <Card key={profile.id} p="$4" bg="$background" elevation="$2">
              <YStack gap="$2">
                <H3>{profile.name}</H3>
                <Paragraph color="$color11">{profile.affiliation}</Paragraph>
                <Paragraph>{profile.bio}</Paragraph>
                
                <XStack gap="$2" flexWrap="wrap">
                  {profile.instagram_id && (
                    <Paragraph color="$blue10" fontSize="$2">
                      📷 @{profile.instagram_id}
                    </Paragraph>
                  )}
                  {profile.twitter_id && (
                    <Paragraph color="$blue10" fontSize="$2">
                      🐦 @{profile.twitter_id}
                    </Paragraph>
                  )}
                </XStack>
                
                <Paragraph color="$color9" fontSize="$1">
                  {new Date(profile.created_at).toLocaleDateString('ja-JP')}
                </Paragraph>
              </YStack>
            </Card>
          ))}
        </YStack>
      )}
      
      <Button onPress={fetchProfiles} variant="outlined">
        更新
      </Button>
    </YStack>
  )
}